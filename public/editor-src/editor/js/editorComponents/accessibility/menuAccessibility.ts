import { getCurrentDevice } from "visual/utils/export";
import { parseFromString } from "visual/utils/string";

export enum MenuItemType {
  Dropdown = "dropdown",
  MegaMenu = "megaMenu",
  Link = "link"
}

export interface MenuItemApi {
  open: VoidFunction;
  close: VoidFunction;
  isOpen: () => boolean;
}

export interface MenuItemLink {
  item: HTMLElement;
  type: MenuItemType.Link;
}

export type MenuItemExtendedType =
  | MenuItemType.Dropdown
  | MenuItemType.MegaMenu;

export interface MenuItemExtended {
  item: HTMLElement;
  type: MenuItemExtendedType;
  api: MenuItemApi;
  /**
   * Direct children of this item (one level deeper).
   * Important for correct keyboard navigation.
   */
  children: Array<HTMLElement>;
}

interface MenuItemState {
  item: HTMLElement;
  trigger: HTMLAnchorElement;
  type: MenuItemType;
  api?: MenuItemApi;
  submenu?: HTMLElement;
  directChildren: MenuItemState[];
  parent: MenuItemState | null;
  level: number;
}

export type MenuItem = MenuItemLink | MenuItemExtended;

export class MenuAccessibilityKeyboard {
  private static instanceCounter = 0;

  private rootMenu: HTMLElement;
  private readonly instanceId: number;
  private readonly menuItems: MenuItem[];

  private extendedStates: MenuItemState[] = [];
  private allStates: MenuItemState[] = [];
  private topLevelStates: MenuItemState[] = [];
  private stateByTrigger = new Map<HTMLElement, MenuItemState>();
  private stateByItem = new Map<HTMLElement, MenuItemState>();

  private rootMenuRole: "menubar" | "menu" = "menubar";

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLElement)) {
      return;
    }

    // Handle key events based on the actually focused element.
    // Some environments dispatch keyboard events with document/body as target.
    if (!this.rootMenu.contains(activeElement)) {
      return;
    }

    // Escape should always close any open submenus while focus is within the menu.
    // This covers cases where focus is inside the submenu on a non-trigger element.
    if (event.key === "Escape") {
      event.preventDefault();
      const activeState = this.getActiveState();
      if (activeState?.parent) {
        // Return to the parent trigger while keeping the parent level reachable.
        this.focusParentTrigger(activeState);
        return;
      }
      // Top-level or unknown active state: close everything.
      this.closeAllSubmenus();
      return;
    }

    const activeState = this.getActiveState();
    if (!activeState) {
      return;
    }

    if (event.key === "Tab") {
      // `tabindex` is roving: only one menuitem is focusable at a time.
      // So when focus is inside a submenu and user presses Shift+Tab,
      // we must keep focus within the menu (to parent/previous sibling),
      // otherwise the browser will fall back to the next DOM focusable.
      if (event.shiftKey && activeState.parent) {
        const siblings = this.getSiblings(activeState);
        const index = siblings.findIndex((s) => s === activeState);

        if (index > 0) {
          event.preventDefault();
          const prev = siblings[index - 1];
          this.closeSubmenusExcept(prev);
          this.setActiveTrigger(prev);
          prev.trigger.focus();
          return;
        }

        if (index === 0) {
          event.preventDefault();
          this.focusParentTrigger(activeState);
          return;
        }
      }

      const direction = event.shiftKey ? -1 : 1;

      // If the current item controls an opened submenu, move focus into it.
      // Otherwise, let browser `Tab` move focus out of the menu.
      if (this.isSubmenuOpen(activeState)) {
        const children = activeState.directChildren;
        const target =
          children[direction === 1 ? 0 : children.length - 1] ?? null;

        if (!target) {
          // Nothing to focus inside the opened submenu => don't trap keyboard users.
          return;
        }

        event.preventDefault();
        // Keep the current submenu open and close any others.
        this.closeSubmenusExcept(activeState);

        this.setActiveTrigger(target);
        target.trigger.focus();
        return;
      }

      return;
    }

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        this.handleArrowDown(activeState);
        return;
      }
      case "ArrowUp": {
        event.preventDefault();
        this.handleArrowUp(activeState);
        return;
      }
      case "ArrowLeft": {
        event.preventDefault();
        this.handleArrowLeft(activeState);
        return;
      }
      case "ArrowRight": {
        event.preventDefault();
        this.handleArrowRight(activeState);
        return;
      }
      case "Home": {
        event.preventDefault();
        this.focusBoundaryInSameLevel(activeState, true);
        return;
      }
      case "End": {
        event.preventDefault();
        this.focusBoundaryInSameLevel(activeState, false);
        return;
      }
      // Escape is handled early to support focusing non-trigger elements.
      case "Enter": {
        event.preventDefault();
        this.handleEnter(activeState);
        return;
      }
      case " ":
      case "Spacebar": {
        event.preventDefault();
        this.handleSpace(activeState);
        return;
      }
    }
  };

  private readonly onPointerDown = (event: MouseEvent): void => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const menuContainer = this.rootMenu.closest(".brz-menu__container");
    if (
      menuContainer &&
      event.target.closest(".brz-menu__container") === menuContainer
    ) {
      return;
    }

    this.closeAllSubmenus();
  };

  constructor(rootMenu: HTMLElement, menuItems: MenuItem[]) {
    this.rootMenu = rootMenu;
    this.instanceId = MenuAccessibilityKeyboard.instanceCounter++;
    this.menuItems = menuItems;
  }

  public init(): void {
    if (this.rootMenu.dataset.brzMenuA11yInit === "true") {
      return;
    }
    this.rootMenu.dataset.brzMenuA11yInit = "true";

    this.buildStates();
    this.applyRolesAndAria();
    this.wrapApisWithAriaSync();
    this.initFocusModel();
    this.attachListeners();
  }

  private buildStates(): void {
    this.allStates = this.menuItems
      .map((menuItem) => {
        const trigger = menuItem.item.querySelector<HTMLAnchorElement>("a");
        if (!trigger) {
          return null;
        }

        const isExtended = this.isExtendedMenuItem(menuItem);
        const submenu =
          (isExtended
            ? menuItem.item.querySelector<HTMLElement>(".brz-menu__sub-menu") ||
              menuItem.item.querySelector<HTMLElement>(".brz-mega-menu__portal")
            : undefined) ?? undefined;

        const state: MenuItemState = {
          item: menuItem.item,
          trigger,
          type: menuItem.type,
          api: isExtended ? menuItem.api : undefined,
          directChildren: [],
          parent: null,
          level: 0,
          submenu
        };
        return state;
      })
      .filter((v): v is MenuItemState => v !== null);

    // Create lookup maps
    this.stateByTrigger.clear();
    this.stateByItem.clear();
    this.allStates.forEach((s) => {
      this.stateByTrigger.set(s.trigger, s);
      this.stateByItem.set(s.item, s);
    });

    // Set parent pointers + direct children using the original input.
    for (const menuItem of this.menuItems) {
      const parentState = this.stateByItem.get(menuItem.item);
      if (!parentState) continue;
      if (!this.isExtendedMenuItem(menuItem)) continue;

      parentState.directChildren = menuItem.children
        .map((childEl) => this.stateByItem.get(childEl))
        .filter((v): v is MenuItemState => v !== undefined);

      parentState.directChildren.forEach((childState) => {
        childState.parent = parentState;
      });
    }

    // Compute levels (depth from the top-level).
    const computeLevel = (state: MenuItemState): number =>
      state.parent ? computeLevel(state.parent) + 1 : 0;

    this.allStates.forEach((s) => {
      s.level = computeLevel(s);
    });
    this.topLevelStates = this.allStates.filter((s) => s.parent === null);
    this.extendedStates = this.allStates.filter((s) => s.api !== undefined);
  }

  private applyRolesAndAria(): void {
    // Root role
    this.rootMenu.setAttribute("role", this.rootMenuRole);

    // roving tabindex + active descendant updates will target root menu
    this.rootMenu.removeAttribute("aria-activedescendant");

    // Set orientation based on current device menu layout.
    const mods =
      parseFromString<Record<string, "vertical" | "horizontal">>(
        this.rootMenu.getAttribute("data-mods") ?? "{}"
      ) ?? {};

    const orientation =
      mods[getCurrentDevice()] === "vertical" ? "vertical" : "horizontal";
    this.rootMenu.setAttribute("aria-orientation", orientation);

    // Roles/ARIA for menu items and their submenus
    this.allStates.forEach((state, index) => {
      const triggerId =
        state.trigger.id || `brz-menuitem-${this.instanceId}-${index}`;
      state.trigger.id = triggerId;
      state.trigger.setAttribute("role", "menuitem");
      state.trigger.setAttribute("tabindex", "-1");

      if (state.api) {
        const isOpen = state.api.isOpen();
        state.trigger.setAttribute("aria-haspopup", "true");
        state.trigger.setAttribute("aria-expanded", isOpen.toString());

        if (state.submenu) {
          const submenuId =
            state.submenu.id || `brz-submenu-${this.instanceId}-${index}`;
          state.submenu.id = submenuId;
          state.submenu.setAttribute("role", "menu");
          state.submenu.setAttribute("aria-labelledby", triggerId);
          state.trigger.setAttribute("aria-controls", submenuId);
          state.submenu.setAttribute("aria-hidden", (!isOpen).toString());
        }
      }
    });
  }

  private wrapApisWithAriaSync(): void {
    this.extendedStates.forEach((state) => {
      if (!state.api) return;
      const api = state.api;

      // Guard against double-wrapping
      const marker = `brzMenuA11yWrapped-${this.instanceId}`;
      if ((api as unknown as { [key: string]: unknown })[marker] === true) {
        return;
      }

      const origOpen = api.open.bind(api);
      const origClose = api.close.bind(api);

      const sync = (): void => {
        const isOpen = api.isOpen();
        state.trigger.setAttribute("aria-expanded", isOpen.toString());
        if (state.submenu) {
          state.submenu.setAttribute("aria-hidden", (!isOpen).toString());
        }
      };

      api.open = () => {
        origOpen();
        sync();
      };
      api.close = () => {
        origClose();
        sync();
      };

      (api as unknown as { [key: string]: unknown })[marker] = true;
    });
  }

  private initFocusModel(): void {
    // Ensure only one menuitem per root is tabbable.
    // APG: Tab moves focus to the active menuitem; arrow keys then handle in-menu navigation.
    const firstTop = this.topLevelStates[0];

    // If focus is already inside this menu on load, respect it.
    const existingState = this.getActiveState();
    if (existingState) {
      this.setActiveTrigger(existingState);
    } else if (firstTop) {
      this.setActiveTrigger(firstTop);
    }
  }

  private attachListeners(): void {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("mousedown", this.onPointerDown);
    // Close on keyboard focus leaving the menu completely.
    // This prevents "stuck" mega-menus when focus moves outside triggers/submenu items.
    this.rootMenu.addEventListener("focusout", this.onFocusOut, true);

    this.allStates.forEach((state) => {
      state.trigger.addEventListener("focus", () => {
        // Menu open/close is keyboard-driven (Enter/ArrowDown/ArrowRight).
        // Focus just updates the active descendant / roving tabindex.
        this.setActiveTrigger(state);
      });
    });
  }

  private readonly onFocusOut = (event: FocusEvent): void => {
    const relatedTarget = event.relatedTarget;
    const fallbackState = this.getStateFromElement(event.target);
    if (!(relatedTarget instanceof HTMLElement)) {
      // Focus is leaving the menu (to body/outside); close everything.
      this.closeAllSubmenus();
      this.restoreVisibleTabStop(fallbackState);
      return;
    }

    // If the newly focused element is outside the menu root, close everything.
    if (!this.rootMenu.contains(relatedTarget)) {
      this.closeAllSubmenus();
      this.restoreVisibleTabStop(fallbackState);
    }
  };

  private getActiveState(): MenuItemState | null {
    const active = document.activeElement;
    return this.getStateFromElement(active);
  }

  private getStateFromElement(element: EventTarget | null): MenuItemState | null {
    const activeEl = element instanceof HTMLElement ? element : null;
    if (!activeEl) return null;

    // Prefer resolving active state from a trigger <a>.
    const trigger = activeEl.closest<HTMLAnchorElement>("a");
    if (trigger) {
      return this.stateByTrigger.get(trigger) ?? null;
    }

    // Otherwise, resolve by the closest submenu/mega-menu container.
    const submenuEl = activeEl.closest<HTMLElement>(
      ".brz-menu__sub-menu, .brz-mega-menu__portal"
    );
    if (!submenuEl) return null;

    return this.allStates.find((s) => s.submenu === submenuEl) ?? null;
  }

  private getTopLevelState(state: MenuItemState): MenuItemState {
    let current = state;

    while (current.parent) {
      current = current.parent;
    }

    return current;
  }

  private restoreVisibleTabStop(state: MenuItemState | null): void {
    const fallbackState = state
      ? this.getTopLevelState(state)
      : this.topLevelStates[0];

    if (!fallbackState) {
      return;
    }

    this.setActiveTrigger(fallbackState);
  }

  private getSiblings(state: MenuItemState): MenuItemState[] {
    if (state.parent == null) {
      return this.topLevelStates;
    }
    return state.parent.directChildren;
  }

  private setActiveTrigger(state: MenuItemState): void {
    const container =
      state.parent == null
        ? this.rootMenu
        : (state.parent.submenu ?? this.rootMenu);

    this.allStates.forEach((s) => s.trigger.setAttribute("tabindex", "-1"));
    state.trigger.setAttribute("tabindex", "0");
    container.setAttribute("aria-activedescendant", state.trigger.id);
  }

  private closeAllSubmenus(): void {
    this.extendedStates.forEach((state) => {
      if (state.api?.isOpen()) {
        state.api.close();
      }
    });
  }

  private closeSubmenusExcept(target: MenuItemState): void {
    // Keep only ancestor submenus open (plus target's submenu if it is already open).
    const keep = new Set<MenuItemState>();
    let p: MenuItemState | null = target.parent;
    while (p) {
      keep.add(p);
      p = p.parent;
    }
    if (target.api?.isOpen()) {
      keep.add(target);
    }

    this.extendedStates.forEach((state) => {
      if (!state.api) return;
      if (!state.api.isOpen()) return;
      if (keep.has(state)) return;
      state.api.close();
    });
  }

  private openSubmenuAndFocusChild(
    parent: MenuItemState,
    childIndex: number
  ): void {
    if (!parent.api) return;

    // Always open the submenu if the parent controls one.
    // Even if children are not present in DOM yet, some mega-menus render lazily.
    const target =
      parent.directChildren[childIndex] ??
      // If there's nothing to focus, keep the parent itself as "target"
      parent;
    this.closeSubmenusExcept(target);
    parent.api.open();

    const child = parent.directChildren[childIndex];
    if (!child) {
      // Keep focus on the parent trigger if we can't focus a child.
      return;
    }
    this.setActiveTrigger(child);
    child.trigger.focus();
  }

  private focusSiblingAtOffset(state: MenuItemState, offset: number): void {
    const siblings = this.getSiblings(state);
    if (!siblings.length) return;

    const index = siblings.findIndex((s) => s === state);
    if (index === -1) return;

    const nextIndex = (index + offset + siblings.length) % siblings.length;
    const next = siblings[nextIndex];

    this.closeSubmenusExcept(next);
    this.setActiveTrigger(next);
    next.trigger.focus();
  }

  private focusBoundaryInSameLevel(
    state: MenuItemState,
    focusFirst: boolean
  ): void {
    const siblings = this.getSiblings(state);
    if (!siblings.length) return;
    const target = siblings[focusFirst ? 0 : siblings.length - 1];
    this.closeSubmenusExcept(target);
    this.setActiveTrigger(target);
    target.trigger.focus();
  }

  private focusParentTrigger(state: MenuItemState): void {
    const parent = state.parent;
    if (!parent) {
      return;
    }

    this.closeSubmenusExcept(parent);
    this.setActiveTrigger(parent);
    parent.trigger.focus();
  }

  private handleArrowDown(activeState: MenuItemState): void {
    if (activeState.level === 0 && activeState.api) {
      // Open submenu and focus the first child (if available)
      this.openSubmenuAndFocusChild(activeState, 0);
      return;
    }

    // Move within the same level
    this.focusSiblingAtOffset(activeState, +1);
  }

  private handleArrowUp(activeState: MenuItemState): void {
    if (activeState.level === 0 && activeState.api) {
      // Open submenu and focus the last child (if available)
      this.openSubmenuAndFocusChild(
        activeState,
        activeState.directChildren.length - 1
      );
      return;
    }

    this.focusSiblingAtOffset(activeState, -1);
  }

  private handleArrowLeft(activeState: MenuItemState): void {
    if (activeState.parent) {
      // Return to the parent trigger while keeping the parent level reachable.
      this.focusParentTrigger(activeState);
      return;
    }

    // Top level: move to previous top-level item.
    this.focusSiblingAtOffset(activeState, -1);
  }

  private handleArrowRight(activeState: MenuItemState): void {
    if (!activeState.parent) {
      // Menubar top level: move to next item.
      this.focusSiblingAtOffset(activeState, +1);
      return;
    }

    if (activeState.api) {
      // Open submenu and focus first child (if available).
      this.openSubmenuAndFocusChild(activeState, 0);
      return;
    }

    // No submenu: move within the same level.
    this.focusSiblingAtOffset(activeState, +1);
  }

  private handleEnter(activeState: MenuItemState): void {
    if (activeState.api) {
      // Open submenu; do not "activate" navigation for menu triggers with submenus.
      this.openSubmenuAndFocusChild(activeState, 0);
      return;
    }

    // Trigger the link for leaf items.
    activeState.trigger.click();
  }

  private handleSpace(activeState: MenuItemState): void {
    // Anchors do not always activate with Space, so explicitly click.
    if (activeState.api) {
      this.openSubmenuAndFocusChild(activeState, 0);
      return;
    }

    activeState.trigger.click();
  }

  static getMenuItemType(item: HTMLElement): MenuItemType {
    if (item.classList.contains("brz-menu__item-dropdown")) {
      return MenuItemType.Dropdown;
    }
    if (item.classList.contains("brz-menu__item-mega-menu")) {
      return MenuItemType.MegaMenu;
    }

    return MenuItemType.Link;
  }

  private isExtendedMenuItem(item: MenuItem): item is MenuItemExtended {
    return item.type !== MenuItemType.Link;
  }

  private isSubmenuOpen(state: MenuItemState): boolean {
    return (
      (state.api?.isOpen?.() ?? false) ||
      state.trigger.getAttribute("aria-expanded") === "true"
    );
  }
}
