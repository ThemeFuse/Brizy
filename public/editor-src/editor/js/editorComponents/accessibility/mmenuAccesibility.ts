import { MenuItemApi } from "./menuAccessibility";

interface MMenuAccessibilityApi {
  open: VoidFunction;
  close: VoidFunction;
  openPanel: (panel: HTMLElement) => void;
  closePanel: (panel: HTMLElement) => void;
}

interface MMenuAccessibilityOptions {
  trigger: HTMLElement;
  menuApi: MMenuAccessibilityApi;
  label?: string;
}

interface MMenuItemState {
  item: HTMLElement;
  panel: HTMLElement;
  trigger: HTMLAnchorElement;
  openButton?: HTMLAnchorElement;
  submenu?: HTMLElement;
  parent: MMenuItemState | null;
  directChildren: MMenuItemState[];
  api?: MenuItemApi;
}

export class MMenuAccessibilityKeyboard {
  private static instanceCounter = 0;

  private readonly rootMenu: HTMLElement;
  private readonly trigger: HTMLElement;
  private readonly menuApi: MMenuAccessibilityApi;
  private readonly label: string;
  private readonly instanceId: number;

  private allStates: MMenuItemState[] = [];
  private topLevelStates: MMenuItemState[] = [];
  private stateByTrigger = new Map<HTMLElement, MMenuItemState>();
  private statesByPanel = new Map<HTMLElement, MMenuItemState[]>();
  private panelsById = new Map<string, HTMLElement>();
  private pendingOpenedState: MMenuItemState | null = null;
  private pendingClosedParentState: MMenuItemState | null = null;

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (!this.isMenuOpen()) {
      return;
    }

    const activeElement = document.activeElement;
    const triggerFocusedState = this.getTriggerStateFromElement(activeElement);
    const activeState =
      triggerFocusedState ?? this.getOwnerStateFromElement(activeElement);

    if (!activeState) {
      return;
    }

    if (!triggerFocusedState) {
      const panelFocusables = activeState.submenu
        ? this.getFocusableElementsInPanel(activeState.submenu)
        : [];
      const activeIndex = panelFocusables.findIndex(
        (element) => element === activeElement
      );

      switch (event.key) {
        case "Tab": {
          if (!panelFocusables.length || activeIndex === -1) {
            return;
          }

          event.preventDefault();
          const direction = event.shiftKey ? -1 : 1;
          const nextIndex =
            (activeIndex + direction + panelFocusables.length) %
            panelFocusables.length;
          panelFocusables[nextIndex]?.focus();
          return;
        }
        case "ArrowDown": {
          if (!panelFocusables.length || activeIndex === -1) {
            return;
          }

          event.preventDefault();
          const nextIndex = (activeIndex + 1) % panelFocusables.length;
          panelFocusables[nextIndex]?.focus();
          return;
        }
        case "ArrowUp": {
          if (!panelFocusables.length || activeIndex === -1) {
            return;
          }

          event.preventDefault();
          const nextIndex =
            (activeIndex - 1 + panelFocusables.length) % panelFocusables.length;
          panelFocusables[nextIndex]?.focus();
          return;
        }
        case "Home": {
          if (!panelFocusables.length) {
            return;
          }

          event.preventDefault();
          panelFocusables[0]?.focus();
          return;
        }
        case "End": {
          if (!panelFocusables.length) {
            return;
          }

          event.preventDefault();
          panelFocusables[panelFocusables.length - 1]?.focus();
          return;
        }
        case "ArrowLeft":
        case "Escape": {
          event.preventDefault();
          if (activeState.api?.isOpen()) {
            this.setActiveTrigger(activeState);
            activeState.trigger.focus();
          } else if (activeState.parent) {
            this.closeCurrentPanelAndFocusParent(activeState);
          } else {
            this.menuApi.close();
          }
          return;
        }
        default:
          return;
      }
    }

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        this.focusSiblingAtOffset(activeState, +1);
        return;
      }
      case "ArrowUp": {
        event.preventDefault();
        this.focusSiblingAtOffset(activeState, -1);
        return;
      }
      case "ArrowRight": {
        if (!activeState.api) {
          return;
        }
        event.preventDefault();
        this.openSubmenuAndFocusChild(activeState);
        return;
      }
      case "ArrowLeft": {
        event.preventDefault();
        if (activeState.parent) {
          this.closeCurrentPanelAndFocusParent(activeState);
        } else {
          this.menuApi.close();
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
      case "Enter":
      case " ":
      case "Spacebar": {
        event.preventDefault();
        if (activeState.api) {
          this.openSubmenuAndFocusChild(activeState);
          return;
        }
        activeState.trigger.click();
        return;
      }
      case "Escape": {
        event.preventDefault();
        if (activeState.parent) {
          this.closeCurrentPanelAndFocusParent(activeState);
        } else {
          this.menuApi.close();
        }
        return;
      }
    }
  };

  private readonly onFocusOut = (event: FocusEvent): void => {
    if (!this.isMenuOpen()) {
      return;
    }

    const relatedTarget = event.relatedTarget;
    if (relatedTarget === this.trigger) {
      return;
    }

    if (!(relatedTarget instanceof HTMLElement)) {
      this.menuApi.close();
      return;
    }

    if (!this.rootMenu.contains(relatedTarget)) {
      this.menuApi.close();
    }
  };

  constructor(rootMenu: HTMLElement, options: MMenuAccessibilityOptions) {
    this.rootMenu = rootMenu;
    this.trigger = options.trigger;
    this.menuApi = options.menuApi;
    this.label = options.label || "Menu";
    this.instanceId = MMenuAccessibilityKeyboard.instanceCounter++;
  }

  public init(): void {
    if (this.rootMenu.dataset.brzMmenuA11yInit === "true") {
      return;
    }

    this.rootMenu.dataset.brzMmenuA11yInit = "true";
    this.buildStates();
    this.applyRolesAndAria();
    this.initFocusModel();
    this.attachListeners();
    this.syncMenuState(false);
  }

  public onMenuOpened(): void {
    this.syncMenuState(true);
    const target = this.getCurrentPanelStates()[0] ?? this.topLevelStates[0];
    if (target) {
      this.setActiveTrigger(target);
      requestAnimationFrame(() => {
        target.trigger.focus();
      });
      return;
    }

    requestAnimationFrame(() => {
      this.rootMenu.focus();
    });
  }

  public onMenuClosed(restoreTrigger = true): void {
    this.pendingOpenedState = null;
    this.pendingClosedParentState = null;
    this.syncMenuState(false);

    const firstTopLevelState = this.topLevelStates[0];
    if (firstTopLevelState) {
      this.setActiveTrigger(firstTopLevelState);
    }

    if (restoreTrigger) {
      requestAnimationFrame(() => {
        this.trigger.focus();
      });
    }
  }

  public onPanelOpened(panel: HTMLElement): void {
    this.syncSubmenuStates();

    const parentState =
      this.pendingOpenedState ??
      this.allStates.find((state) => state.submenu === panel) ??
      null;
    this.pendingOpenedState = null;

    const target =
      parentState?.directChildren[0] ?? this.getPanelStates(panel)[0];
    if (!target) {
      const firstFocusable = this.getFirstFocusableInPanel(panel);
      if (firstFocusable) {
        requestAnimationFrame(() => {
          firstFocusable.focus();
        });
      }
      return;
    }

    this.setActiveTrigger(target);
    requestAnimationFrame(() => {
      target.trigger.focus();
    });
  }

  public onPanelClosed(panel: HTMLElement): void {
    this.syncSubmenuStates();

    const parentState =
      this.pendingClosedParentState ??
      this.allStates.find((state) => state.submenu === panel) ??
      null;
    this.pendingClosedParentState = null;

    if (!parentState) {
      return;
    }

    this.setActiveTrigger(parentState);
    requestAnimationFrame(() => {
      parentState.trigger.focus();
    });
  }

  private buildStates(): void {
    const panels = Array.from(
      this.rootMenu.querySelectorAll<HTMLElement>(
        ".brz-mm-panel[id]:not(.brz-mm-panels)"
      )
    );
    const panelIdsWithParents = new Set<string>();

    this.panelsById.clear();
    panels.forEach((panel) => {
      this.panelsById.set(panel.id, panel);
    });

    this.allStates = panels.flatMap((panel) => {
      const panelStates = Array.from(
        panel.querySelectorAll<HTMLElement>(".brz-menu__item")
      )
        .filter(
          (item) =>
            item.closest<HTMLElement>(
              ".brz-mm-panel[id]:not(.brz-mm-panels)"
            ) === panel
        )
        .map((item) => {
          const trigger =
            item.querySelector<HTMLAnchorElement>(".brz-mm-listitem__text") ??
            Array.from(item.querySelectorAll<HTMLAnchorElement>("a")).find(
              (link) => !link.classList.contains("brz-mm-btn_next")
            ) ??
            null;

          if (!trigger) {
            return null;
          }

          const openButton = item.querySelector<HTMLAnchorElement>(
            ".brz-mm-btn_next[href^='#']"
          );
          const targetPanelId = openButton?.getAttribute("href") ?? "";
          const submenu = this.panelsById.get(targetPanelId.replace(/^#/, ""));

          if (submenu) {
            panelIdsWithParents.add(submenu.id);
          }

          const state: MMenuItemState = {
            item,
            panel,
            trigger,
            openButton: openButton ?? undefined,
            submenu,
            parent: null,
            directChildren: []
          };

          if (submenu) {
            state.api = {
              open: () => {
                this.menuApi.openPanel(submenu);
              },
              close: () => {
                this.menuApi.closePanel(submenu);
              },
              isOpen: () => this.isPanelVisible(submenu)
            };
          }

          return state;
        })
        .filter((state): state is MMenuItemState => state !== null);

      this.statesByPanel.set(panel, panelStates);
      return panelStates;
    });

    this.stateByTrigger.clear();
    this.allStates.forEach((state) => {
      this.stateByTrigger.set(state.trigger, state);
    });

    this.allStates.forEach((state) => {
      if (!state.submenu) {
        return;
      }

      const children = this.getPanelStates(state.submenu);
      state.directChildren = children;
      children.forEach((child) => {
        child.parent = state;
      });
    });

    const topLevelPanel =
      panels.find((panel) => !panelIdsWithParents.has(panel.id)) ?? panels[0];
    this.topLevelStates = topLevelPanel
      ? this.getPanelStates(topLevelPanel)
      : [];
  }

  private applyRolesAndAria(): void {
    const rootMenuId = this.rootMenu.id || `brz-mmenu-${this.instanceId}`;
    this.rootMenu.id = rootMenuId;
    this.rootMenu.setAttribute("role", "dialog");
    this.rootMenu.setAttribute("aria-modal", "true");
    this.rootMenu.setAttribute("tabindex", "-1");
    this.rootMenu.setAttribute("aria-label", this.label);

    this.trigger.setAttribute("aria-haspopup", "dialog");
    this.trigger.setAttribute("aria-controls", rootMenuId);

    this.panelsById.forEach((panel) => {
      panel.setAttribute("role", "menu");
      panel.setAttribute("aria-hidden", String(!this.isPanelVisible(panel)));

      panel
        .querySelectorAll<HTMLElement>(".brz-mm-navbar__title")
        .forEach((element) => {
          element.setAttribute("tabindex", "-1");
        });

      panel
        .querySelectorAll<HTMLElement>(".brz-mm-btn_next")
        .forEach((element) => {
          element.setAttribute("tabindex", "-1");
          element.setAttribute("aria-hidden", "true");
        });
    });

    this.allStates.forEach((state, index) => {
      const triggerId =
        state.trigger.id || `brz-mmenuitem-${this.instanceId}-${index}`;
      state.trigger.id = triggerId;
      state.trigger.setAttribute("role", "menuitem");
      state.trigger.setAttribute("tabindex", "-1");

      if (state.api && state.submenu) {
        state.trigger.setAttribute("aria-haspopup", "true");
        state.trigger.setAttribute("aria-expanded", String(state.api.isOpen()));
        state.trigger.setAttribute("aria-controls", state.submenu.id);
        state.submenu.setAttribute("aria-labelledby", triggerId);
      }
    });
  }

  private initFocusModel(): void {
    const firstTopLevelState = this.topLevelStates[0];
    if (firstTopLevelState) {
      this.setActiveTrigger(firstTopLevelState);
    }
  }

  private attachListeners(): void {
    this.rootMenu.addEventListener("keydown", this.onKeyDown);
    this.rootMenu.addEventListener("focusout", this.onFocusOut, true);

    this.allStates.forEach((state) => {
      state.trigger.addEventListener("focus", () => {
        this.setActiveTrigger(state);
      });
    });
  }

  private syncMenuState(isOpen: boolean): void {
    this.trigger.setAttribute("aria-expanded", String(isOpen));
    this.rootMenu.setAttribute("aria-hidden", String(!isOpen));
    this.syncSubmenuStates();
  }

  private syncSubmenuStates(): void {
    this.panelsById.forEach((panel) => {
      panel.setAttribute("aria-hidden", String(!this.isPanelVisible(panel)));
    });

    this.allStates.forEach((state) => {
      if (!state.api || !state.submenu) {
        return;
      }

      const isOpen = state.api.isOpen();
      state.trigger.setAttribute("aria-expanded", String(isOpen));
      state.submenu.setAttribute("aria-hidden", String(!isOpen));
    });
  }

  private isMenuOpen(): boolean {
    return this.rootMenu.classList.contains("brz-mm-menu_opened");
  }

  private getCurrentOpenPanel(): HTMLElement | null {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      const activePanel = activeElement.closest<HTMLElement>(
        ".brz-mm-panel[id]:not(.brz-mm-panels)"
      );

      if (activePanel && this.rootMenu.contains(activePanel)) {
        return activePanel;
      }
    }

    const openedPanels = Array.from(
      this.rootMenu.querySelectorAll<HTMLElement>(
        ".brz-mm-panel_opened:not(.brz-mm-panels)"
      )
    );

    return openedPanels[openedPanels.length - 1] ?? null;
  }

  private isPanelVisible(panel: HTMLElement): boolean {
    return (
      panel.getClientRects().length > 0 &&
      getComputedStyle(panel).visibility !== "hidden" &&
      !panel.classList.contains("brz-mm-hidden")
    );
  }

  private getPanelStates(panel: HTMLElement): MMenuItemState[] {
    return this.statesByPanel.get(panel) ?? [];
  }

  private getTriggerStateFromElement(
    activeElement: Element | null
  ): MMenuItemState | null {
    if (!(activeElement instanceof HTMLElement)) {
      return null;
    }

    const trigger = activeElement.closest<HTMLAnchorElement>("a");
    if (!trigger) {
      return null;
    }

    return this.stateByTrigger.get(trigger) ?? null;
  }

  private getOwnerStateFromElement(
    activeElement: Element | null
  ): MMenuItemState | null {
    if (!(activeElement instanceof HTMLElement)) {
      return null;
    }

    const panel = activeElement.closest<HTMLElement>(".brz-mm-panel[id]");
    if (!panel) {
      return null;
    }

    return this.allStates.find((state) => state.submenu === panel) ?? null;
  }

  private getCurrentPanelStates(): MMenuItemState[] {
    const currentPanel = this.getCurrentOpenPanel();
    return currentPanel
      ? this.getPanelStates(currentPanel)
      : this.topLevelStates;
  }

  private getSiblings(state: MMenuItemState): MMenuItemState[] {
    return state.parent ? state.parent.directChildren : this.topLevelStates;
  }

  private setActiveTrigger(state: MMenuItemState): void {
    const currentPanel = this.getCurrentOpenPanel();
    const container = currentPanel ?? this.rootMenu;

    this.allStates.forEach((entry) =>
      entry.trigger.setAttribute("tabindex", "-1")
    );
    state.trigger.setAttribute("tabindex", "0");
    container.setAttribute("aria-activedescendant", state.trigger.id);
  }

  private focusSiblingAtOffset(state: MMenuItemState, offset: number): void {
    const siblings = this.getSiblings(state);
    if (!siblings.length) {
      return;
    }

    const index = siblings.findIndex((sibling) => sibling === state);
    if (index === -1) {
      return;
    }

    const nextIndex = (index + offset + siblings.length) % siblings.length;
    const next = siblings[nextIndex];
    this.setActiveTrigger(next);
    next.trigger.focus();
  }

  private focusBoundaryInSameLevel(
    state: MMenuItemState,
    focusFirst: boolean
  ): void {
    const siblings = this.getSiblings(state);
    if (!siblings.length) {
      return;
    }

    const target = siblings[focusFirst ? 0 : siblings.length - 1];
    this.setActiveTrigger(target);
    target.trigger.focus();
  }

  private openSubmenuAndFocusChild(state: MMenuItemState): void {
    if (!state.api || !state.submenu) {
      return;
    }

    this.pendingOpenedState = state;
    state.api.open();

    const firstChild = state.directChildren[0];
    if (firstChild) {
      this.setActiveTrigger(firstChild);
      return;
    }

    const firstFocusable = this.getFirstFocusableInPanel(state.submenu);
    if (firstFocusable) {
      requestAnimationFrame(() => {
        firstFocusable.focus();
      });
    }
  }

  private getFirstFocusableInPanel(panel: HTMLElement): HTMLElement | null {
    return this.getFocusableElementsInPanel(panel)[0] ?? null;
  }

  private getFocusableElementsInPanel(panel: HTMLElement): HTMLElement[] {
    return Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => {
      if (
        element.classList.contains("brz-mm-navbar__title") ||
        element.classList.contains("brz-mm-btn_next")
      ) {
        return false;
      }

      return (
        element.getClientRects().length > 0 &&
        getComputedStyle(element).visibility !== "hidden" &&
        !element.classList.contains("brz-mm-hidden")
      );
    });
  }

  private closeCurrentPanelAndFocusParent(state: MMenuItemState): void {
    if (!state.parent) {
      return;
    }

    this.pendingClosedParentState = null;
    this.setActiveTrigger(state.parent);
    state.parent.trigger.focus();
  }
}
