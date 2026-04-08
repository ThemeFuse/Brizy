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
  /** Direct children (one level) for keyboard navigation */
  children: Array<HTMLElement>;
}

/** Runtime graph for one menuitem: trigger, optional submenu root, tree links. */
interface MenuItemState {
  item: HTMLElement;
  trigger: HTMLAnchorElement;
  type: MenuItemType;
  api?: MenuItemApi;
  submenu?: HTMLElement;
  directChildren: MenuItemState[];
  parent: MenuItemState | null;
}

export type MenuItem = MenuItemLink | MenuItemExtended;

const SUBMENU_FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]"
].join(", ");

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
    if ("__brzMenuA11yHandled" in event && event.__brzMenuA11yHandled)
      return;

    const activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLElement)) {
      return;
    }
    // Some environments dispatch key events with body/document as target; we key off activeElement.
    if (!this.isWithinMenuKeyboardScope(activeElement)) {
      return;
    }

    // Escape: close one level / return to parent trigger (APG submenu), or close top-level panel.
    if (event.key === "Escape") {
      const activeState = this.getActiveState();

      if (!activeState && this.isInsideNestedMenuInPortal(activeElement)) {
        return;
      }

      event.preventDefault();
      if (activeState?.parent) {
        this.focusParentTrigger(activeState);
        return;
      }
      if (
        activeState?.submenu &&
        activeState.api &&
        activeState.submenu.contains(activeElement) &&
        activeElement !== activeState.trigger
      ) {
        this.closeSubmenuAndFocusTrigger(activeState);
        return;
      }
      // Focus still on top-level trigger while submenu is open.
      if (activeState?.api?.isOpen?.()) {
        this.closeSubmenuAndFocusTrigger(activeState);
        return;
      }
      this.closeAllSubmenus();
      return;
    }

    const activeState = this.getActiveState();
    if (!activeState) {
      return;
    }

    // Tab: roving tabindex — only one menuitem tabbable; trap Shift+Tab within submenu siblings / parent.
    if (event.key === "Tab") {
      // Focus already inside an open submenu/mega panel (not on the opening trigger): walk focusables or exit.
      if (
        this.isSubmenuOpen(activeState) &&
        activeElement !== activeState.trigger &&
        activeState.submenu?.contains(activeElement) &&
        this.handleTabInsideOpenSubmenu(activeState, activeElement, !event.shiftKey)
      ) {
        event.preventDefault();
        return;
      }

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
      // From the opening trigger: Tab moves into first/last child (or first/last focusable in mega with no children).
      if (this.isSubmenuOpen(activeState)) {
        const children = activeState.directChildren;
        const target =
          children[direction === 1 ? 0 : children.length - 1] ?? null;

        if (!target) {
          const submenu = activeState.submenu;
          const fallback =
            direction === 1
              ? submenu && this.getFocusableEdge(submenu, true)
              : submenu && this.getFocusableEdge(submenu, false);
          // No nested menu items and no focusable — let Tab leave the menu.
          if (!fallback) {
            return;
          }
          event.preventDefault();
          this.closeSubmenusExcept(activeState);
          this.setActiveTrigger(activeState, { focusOnTrigger: false });
          fallback.focus();
          return;
        }

        event.preventDefault();
        this.closeSubmenusExcept(activeState);
        this.setActiveTrigger(target);
        target.trigger.focus();
        return;
      }

      return;
    }

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "ArrowLeft":
      case "ArrowRight": {
        event.preventDefault();
        this.handleArrowKey(event.key, activeState);
        if (document.activeElement !== activeElement) {
          (event as unknown as Record<string, unknown>).__brzMenuA11yHandled =
            true;
        }
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
      case "Enter": {
        // Focus on non-menuitem content inside mega panel — let link/button handle activation.
        if (this.shouldAllowNativeActivate(activeState)) {
          return;
        }
        event.preventDefault();
        this.handleEnter(activeState);
        return;
      }
      case " ":
      case "Spacebar": {
        if (this.shouldAllowNativeActivate(activeState)) {
          return;
        }
        event.preventDefault();
        this.handleSpace(activeState);
        return;
      }
    }
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

  /** Build flat state list, parent/child links, and submenu roots. */
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
            ? menuItem.item.querySelector<HTMLElement>(
                ":scope > .brz-mega-menu__portal"
              ) ||
              menuItem.item.querySelector<HTMLElement>(
                ":scope > .brz-menu__sub-menu"
              )
            : undefined) ?? undefined;

        const state: MenuItemState = {
          item: menuItem.item,
          trigger,
          type: menuItem.type,
          api: isExtended ? menuItem.api : undefined,
          directChildren: [],
          parent: null,
          submenu
        };
        return state;
      })
      .filter((v): v is MenuItemState => v !== null);

    this.stateByTrigger.clear();
    this.stateByItem.clear();
    this.allStates.forEach((s) => {
      this.stateByTrigger.set(s.trigger, s);
      this.stateByItem.set(s.item, s);
    });

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

    this.topLevelStates = this.allStates.filter((s) => s.parent === null);
    this.extendedStates = this.allStates.filter((s) => s.api !== undefined);
  }

  private applyRolesAndAria(): void {
    this.rootMenu.setAttribute("role", this.rootMenuRole);
    // Roving tabindex + `aria-activedescendant` are set on the active container in `setActiveTrigger`.
    this.rootMenu.removeAttribute("aria-activedescendant");

    const mods =
      parseFromString<Record<string, "vertical" | "horizontal">>(
        this.rootMenu.getAttribute("data-mods") ?? "{}"
      ) ?? {};

    const orientation =
      mods[getCurrentDevice()] === "vertical" ? "vertical" : "horizontal";
    this.rootMenu.setAttribute("aria-orientation", orientation);

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

  /** Keep `aria-expanded` / `aria-hidden` in sync when dropdown/mega APIs open or close. */
  private wrapApisWithAriaSync(): void {
    this.extendedStates.forEach((state) => {
      if (!state.api) return;
      const api = state.api;

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
    // Portaled mega menus are not under `.brz-menu`; capture on document to detect focus leaving.
    document.addEventListener("focusout", this.onFocusOut, true);

    this.allStates.forEach((state) => {
      state.trigger.addEventListener("focus", () => {
        this.setActiveTrigger(state);
      });
    });
  }

  /** Close when focus leaves the menu root + all registered submenu portals. */
  private readonly onFocusOut = (event: FocusEvent): void => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (!this.isWithinMenuKeyboardScope(target)) {
      return;
    }

    const relatedTarget = event.relatedTarget;
    const fallbackState = this.getStateFromElement(target);
    if (!(relatedTarget instanceof HTMLElement)) {
      // Focus moved to body / null (e.g. dialog).
      this.closeAllSubmenus();
      this.restoreVisibleTabStop(fallbackState);
      return;
    }

    if (!this.isWithinMenuKeyboardScope(relatedTarget)) {
      this.closeAllSubmenus();
      this.restoreVisibleTabStop(fallbackState);
    }
  };

  private getActiveState(): MenuItemState | null {
    return this.getStateFromElement(document.activeElement);
  }

  private getStateFromElement(
    element: EventTarget | null
  ): MenuItemState | null {
    const activeEl = element instanceof HTMLElement ? element : null;
    if (!activeEl) return null;

    // Prefer resolving active state from a trigger <a>.
    const trigger = activeEl.closest<HTMLAnchorElement>("a");
    if (trigger) {
      const fromTrigger = this.stateByTrigger.get(trigger);
      if (fromTrigger) {
        return fromTrigger;
      }
    }

    // Otherwise, resolve by the closest submenu/mega-menu container.
    const submenuEl = activeEl.closest<HTMLElement>(
      ".brz-menu__sub-menu, .brz-mega-menu__portal"
    );
    if (!submenuEl) return null;

    return this.allStates.find((s) => s.submenu === submenuEl) ?? null;
  }

  private getSubmenuRoots(): HTMLElement[] {
    return this.extendedStates
      .map((s) => s.submenu)
      .filter((n): n is HTMLElement => n instanceof HTMLElement);
  }

  /**
   * Keyboard + focusout scope: menubar root OR any portaled mega/dropdown submenu for this instance.
   */
  private isWithinMenuKeyboardScope(el: HTMLElement): boolean {
    return (
      this.rootMenu.contains(el) ||
      this.getSubmenuRoots().some((root) => root.contains(el))
    );
  }

  /** Horizontal vs vertical strip: maps to different physical keys in `handleArrowKey`. */
  private isMenubarHorizontal(): boolean {
    const mods =
      parseFromString<Record<string, "vertical" | "horizontal">>(
        this.rootMenu.getAttribute("data-mods") ?? "{}"
      ) ?? {};
    return mods[getCurrentDevice()] !== "vertical";
  }

  /**
   * APG submenu: close current, focus adjacent top-level item, open its submenu, keep focus on that trigger.
   */
  private moveToAdjacentMenubar(fromState: MenuItemState, delta: 1 | -1): void {
    const top = this.getTopLevelState(fromState);
    const siblings = this.topLevelStates;
    const idx = siblings.indexOf(top);
    if (idx === -1) {
      return;
    }
    const nextIdx = (idx + delta + siblings.length) % siblings.length;
    const next = siblings[nextIdx];

    this.closeAllSubmenus();
    if (next.api) {
      next.api.open();
    }
    this.setActiveTrigger(next);
    next.trigger.focus();
  }

  private shouldAllowNativeActivate(
    activeState: MenuItemState | null
  ): boolean {
    if (!activeState) {
      return false;
    }
    const activeEl = document.activeElement;
    if (!(activeEl instanceof HTMLElement)) {
      return false;
    }
    if (!activeState.submenu?.contains(activeEl)) {
      return false;
    }
    if (activeEl === activeState.trigger) {
      return false;
    }
    return true;
  }

  /** Focus inside open submenu/mega panel but not on the owning menuitem trigger. */
  private isFocusInsideSubmenuPanel(
    state: MenuItemState,
    el: HTMLElement
  ): boolean {
    return (
      !!state.submenu && state.submenu.contains(el) && el !== state.trigger
    );
  }

  private closeSubmenuAndFocusTrigger(state: MenuItemState): void {
    if (!state.api) {
      return;
    }
    this.closeSubmenusExcept(state);
    state.api.close();
    this.setActiveTrigger(state);
    state.trigger.focus();
  }

  /**
   * Tab / Shift+Tab when focus is already inside an open submenu/mega panel (not on the opening trigger).
   * Forward: next focusable, or close panel and focus parent menuitem on last.
   * Backward: previous focusable, or focus opening trigger on first.
   */
  private handleTabInsideOpenSubmenu(
    state: MenuItemState,
    activeEl: HTMLElement,
    forward: boolean
  ): boolean {
    const sm = state.submenu;
    if (!sm || !sm.contains(activeEl)) {
      return false;
    }

    const focusables = this.getFocusablesInSubmenu(sm);
    let idx = focusables.indexOf(activeEl);
    if (idx === -1) {
      idx = focusables.findIndex((el) => el.contains(activeEl));
    }

    if (focusables.length === 0 || idx === -1) {
      this.closeSubmenuAndFocusTrigger(state);
      return true;
    }

    if (forward) {
      if (idx < focusables.length - 1) {
        this.setActiveTrigger(state, { focusOnTrigger: false });
        focusables[idx + 1].focus();
        return true;
      }
      this.closeSubmenuAndFocusTrigger(state);
      return true;
    }

    if (idx > 0) {
      this.setActiveTrigger(state, { focusOnTrigger: false });
      focusables[idx - 1].focus();
      return true;
    }
    this.closeSubmenusExcept(state);
    this.setActiveTrigger(state);
    state.trigger.focus();
    return true;
  }

  private getFocusablesInSubmenu(submenu: HTMLElement): HTMLElement[] {
    const isMegaPortal = submenu.classList.contains("brz-mega-menu__portal");

    return Array.from(
      submenu.querySelectorAll<HTMLElement>(SUBMENU_FOCUSABLE_SELECTOR)
    ).filter((el) => {
      if (el.closest("[aria-hidden='true']")) {
        return false;
      }
      if (!el.getClientRects().length) {
        return false;
      }
      if (isMegaPortal) {
        const closestSub = el.closest(".brz-menu__sub-menu");
        if (closestSub && submenu.contains(closestSub)) {
          return false;
        }
      }
      const style = window.getComputedStyle(el);
      return style.visibility !== "hidden";
    });
  }

  /** First or last visible focusable in a panel (mega without nested menu items). */
  private getFocusableEdge(
    submenu: HTMLElement,
    first: boolean
  ): HTMLElement | null {
    const list = this.getFocusablesInSubmenu(submenu);
    if (!list.length) {
      return null;
    }
    return first ? list[0] : list[list.length - 1];
  }

  /** Wraps at ends; keeps `aria-activedescendant` on owning menuitem while focus is in content. */
  private cycleFocusableInSubmenu(
    submenu: HTMLElement,
    activeEl: HTMLElement,
    ownerState: MenuItemState,
    delta: 1 | -1
  ): void {
    const focusables = this.getFocusablesInSubmenu(submenu);
    if (!focusables.length) {
      return;
    }
    let idx = focusables.indexOf(activeEl);
    if (idx === -1) {
      idx = focusables.findIndex((el) => el.contains(activeEl));
    }
    if (idx === -1) {
      (delta === 1
        ? focusables[0]
        : focusables[focusables.length - 1]
      )?.focus();
      return;
    }
    const next =
      focusables[(idx + delta + focusables.length) % focusables.length];
    this.setActiveTrigger(ownerState, { focusOnTrigger: false });
    next.focus();
  }

  private getTopLevelState(state: MenuItemState): MenuItemState {
    let current = state;
    while (current.parent) {
      current = current.parent;
    }
    return current;
  }

  /** After closing menus, restore tabindex 0 on a top-level item. */
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

  /**
   * Roving tabindex: one `tabindex="0"` on triggers; `aria-activedescendant` on menubar or parent submenu.
   * When focus is inside a panel, `focusOnTrigger: false` keeps the trigger off the tab order.
   */
  private setActiveTrigger(
    state: MenuItemState,
    options?: { focusOnTrigger?: boolean }
  ): void {
    const focusOnTrigger = options?.focusOnTrigger ?? true;
    const container =
      state.parent == null
        ? this.rootMenu
        : (state.parent.submenu ?? this.rootMenu);

    this.allStates.forEach((s) => s.trigger.setAttribute("tabindex", "-1"));
    state.trigger.setAttribute("tabindex", focusOnTrigger ? "0" : "-1");
    container.setAttribute("aria-activedescendant", state.trigger.id);
  }

  private closeAllSubmenus(): void {
    this.extendedStates.forEach((state) => {
      if (state.api?.isOpen()) {
        state.api.close();
      }
    });
  }

  /** Close every open submenu except ancestors of `target` (and `target` if it stays open). */
  private closeSubmenusExcept(target: MenuItemState): void {
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

  /**
   * Opens parent submenu and focuses first/last child menuitem, or first focusable in mega when no children.
   */
  private openSubmenuAndFocusChild(
    parent: MenuItemState,
    childIndex: number
  ): void {
    if (!parent.api) return;

    this.closeSubmenusExcept(parent.directChildren[childIndex] ?? parent);
    parent.api.open();

    const child = parent.directChildren[childIndex];
    if (!child) {
      if (parent.submenu) {
        const first = this.getFocusableEdge(parent.submenu, true);
        if (first) {
          this.setActiveTrigger(parent, { focusOnTrigger: false });
          first.focus();
        }
      }
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
    const activeEl = document.activeElement;
    if (
      activeEl instanceof HTMLElement &&
      this.isFocusInsideSubmenuPanel(state, activeEl) &&
      state.submenu
    ) {
      const boundary = this.getFocusableEdge(state.submenu, focusFirst);
      if (boundary) {
        this.closeSubmenusExcept(state);
        this.setActiveTrigger(state, { focusOnTrigger: false });
        boundary.focus();
      }
      return;
    }

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

  /**
   * Physical ArrowDown/Up: next/prev sibling menuitem, or cycle focusables in mega (APG submenu list).
   */
  private submenuVerticalStep(
    activeState: MenuItemState,
    activeEl: HTMLElement,
    delta: 1 | -1
  ): void {
    if (activeEl === activeState.trigger && activeState.parent !== null) {
      this.focusSiblingAtOffset(activeState, delta);
      return;
    }

    const sm = activeState.submenu;
    if (sm && this.isFocusInsideSubmenuPanel(activeState, activeEl)) {
      if (activeState.directChildren.length > 0) {
        const fromTrigger = activeEl.closest<HTMLAnchorElement>("a");
        const fromState = fromTrigger
          ? this.stateByTrigger.get(fromTrigger)
          : undefined;
        if (
          fromState &&
          fromState.parent === activeState &&
          activeState.directChildren.includes(fromState)
        ) {
          this.focusSiblingAtOffset(fromState, delta);
          return;
        }
      }
      this.cycleFocusableInSubmenu(sm, activeEl, activeState, delta);
      return;
    }

    if (
      activeState.parent === null &&
      sm?.contains(activeEl) &&
      activeEl !== activeState.trigger
    ) {
      this.cycleFocusableInSubmenu(sm!, activeEl, activeState, delta);
      return;
    }

    if (activeState.parent !== null) {
      this.focusSiblingAtOffset(activeState, delta);
    }
  }

  private submenuArrowLeft(
    activeState: MenuItemState,
    activeEl: HTMLElement
  ): void {
    if (activeState.parent?.parent != null) {
      this.focusParentTrigger(activeState);
      return;
    }
    if (activeState.parent?.parent === null) {
      this.moveToAdjacentMenubar(activeState.parent, -1);
      return;
    }
    if (
      activeState.parent === null &&
      activeState.submenu?.contains(activeEl) &&
      activeEl !== activeState.trigger
    ) {
      this.moveToAdjacentMenubar(activeState, -1);
      return;
    }
    if (
      activeState.parent === null &&
      activeEl === activeState.trigger &&
      activeState.api?.isOpen()
    ) {
      this.moveToAdjacentMenubar(activeState, -1);
    }
  }

  /**
   * Physical ArrowRight (APG submenu): open nested submenu, or leaf → next menubar + open.
   */
  private submenuArrowRight(
    activeState: MenuItemState,
    activeEl: HTMLElement
  ): void {
    const anchor = activeEl.closest<HTMLAnchorElement>("a");
    const childState = anchor ? this.stateByTrigger.get(anchor) : undefined;

    if (
      childState &&
      activeState.submenu?.contains(activeEl) &&
      childState.api
    ) {
      this.openSubmenuAndFocusChild(childState, 0);
      return;
    }

    if (activeState.api && activeEl === activeState.trigger) {
      this.openSubmenuAndFocusChild(activeState, 0);
      return;
    }

    if (activeState.parent !== null) {
      if (activeState.api) {
        this.openSubmenuAndFocusChild(activeState, 0);
      } else {
        this.moveToAdjacentMenubar(activeState, +1);
      }
      return;
    }

    if (
      activeState.parent === null &&
      activeState.submenu?.contains(activeEl) &&
      activeEl !== activeState.trigger
    ) {
      if (childState?.api) {
        this.openSubmenuAndFocusChild(childState, 0);
      } else {
        this.moveToAdjacentMenubar(activeState, +1);
      }
    }
  }

  /**
   * Routes menubar vs submenu keys. Menubar strip uses orientation (`mk`); submenu always uses
   * physical Down/Up for list navigation and Left/Right for APG close/open-adjacent behavior.
   */
  private handleArrowKey(key: string, activeState: MenuItemState): void {
    const activeEl = document.activeElement;
    if (!(activeEl instanceof HTMLElement)) {
      return;
    }

    const horizontal = this.isMenubarHorizontal();
    const mk = horizontal
      ? {
          next: "ArrowRight",
          prev: "ArrowLeft",
          openFirst: "ArrowDown",
          openLast: "ArrowUp"
        }
      : {
          next: "ArrowDown",
          prev: "ArrowUp",
          openFirst: "ArrowRight",
          openLast: "ArrowLeft"
        };

    const onTopTrigger =
      activeState.parent === null && activeEl === activeState.trigger;

    if (onTopTrigger) {
      if (key === mk.openFirst && activeState.api) {
        this.openSubmenuAndFocusChild(activeState, 0);
        return;
      }
      if (key === mk.openLast && activeState.api) {
        this.openSubmenuAndFocusChild(
          activeState,
          activeState.directChildren.length - 1
        );
        return;
      }
      if (key === mk.next) {
        this.focusSiblingAtOffset(activeState, +1);
        return;
      }
      if (key === mk.prev) {
        this.focusSiblingAtOffset(activeState, -1);
      }
      return;
    }

    if (this.isDelegatedToNestedMenu(activeState, activeEl)) {
      return;
    }

    if (key === "ArrowDown" || key === "ArrowUp") {
      this.submenuVerticalStep(
        activeState,
        activeEl,
        key === "ArrowDown" ? 1 : -1
      );
      return;
    }
    if (key === "ArrowLeft") {
      this.submenuArrowLeft(activeState, activeEl);
      return;
    }
    if (key === "ArrowRight") {
      this.submenuArrowRight(activeState, activeEl);
    }
  }

  private handleEnter(activeState: MenuItemState): void {
    if (activeState.api) {
      // Parent item: open submenu; leaf: activate link (click).
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

  /**
   * When focus is inside a nested `.brz-menu` placed within a mega-menu portal,
   * arrow-key navigation should be handled by that inner menu's own
   * MenuAccessibilityKeyboard instance rather than the outer one.
   */
  private isDelegatedToNestedMenu(
    state: MenuItemState,
    el: HTMLElement
  ): boolean {
    if (state.type !== MenuItemType.MegaMenu) return false;
    if (!state.submenu?.contains(el)) return false;
    if (el === state.trigger) return false;
    const nestedMenu = el.closest<HTMLElement>(".brz-menu");
    return nestedMenu !== null && state.submenu.contains(nestedMenu);
  }

  private isInsideNestedMenuInPortal(el: HTMLElement): boolean {
    return this.extendedStates.some((s) => {
      if (s.type !== MenuItemType.MegaMenu) return false;
      if (!s.submenu?.contains(el)) return false;
      const nestedMenu = el.closest<HTMLElement>(".brz-menu");
      return nestedMenu !== null && s.submenu.contains(nestedMenu);
    });
  }

  private isSubmenuOpen(state: MenuItemState): boolean {
    return (
      (state.api?.isOpen?.() ?? false) ||
      state.trigger.getAttribute("aria-expanded") === "true"
    );
  }
}
