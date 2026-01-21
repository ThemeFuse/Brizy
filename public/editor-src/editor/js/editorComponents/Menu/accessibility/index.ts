export enum MenuItemType {
  Dropdown = "dropdown",
  MegaMenu = "megaMenu",
  Link = "link"
}

interface LinkItem {
  item: HTMLElement;
  type: "link";
}

export interface MenuItemApi {
  open: VoidFunction;
  close: VoidFunction;
  isOpen: () => boolean;
}

interface ExtendedMenuItem {
  item: HTMLElement;
  type: Exclude<MenuItemType, "link">;
  api: MenuItemApi;
  children: Array<HTMLElement>;
}

type MenuItem = LinkItem | ExtendedMenuItem;

export class MenuAccessibilityKeyboard {
  private menuItems: MenuItem[];

  constructor(menuItems: MenuItem[]) {
    this.menuItems = menuItems;
  }

  public init() {
    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
    document.addEventListener("mousedown", (event) =>
      this.handleMouseDownOutside(event)
    );

    this.menuItems.forEach((item) => {
      const { item: itemElement } = item;
      const linkElement = itemElement.querySelector("a");

      // Set initial ARIA attributes
      this.setAriaAttributes(item);

      linkElement?.addEventListener("focus", () => this.handleFocus(item));
      linkElement?.addEventListener("focusout", () =>
        this.handleFocusOut(item)
      );
    });
  }

  private setAriaAttributes(item: MenuItem): void {
    const { item: itemElement } = item;
    const linkElement = itemElement.querySelector("a");

    if (!linkElement) {
      return;
    }

    // Set role for menu item link
    linkElement.setAttribute("role", "menuitem");

    if (this.isExtendedMenuItem(item)) {
      // For dropdown and mega menu items
      linkElement.setAttribute("aria-haspopup", "true");
      linkElement.setAttribute("aria-expanded", item.api.isOpen().toString());

      // Find and set role on submenu container
      const submenu =
        itemElement.querySelector(".brz-menu__sub-menu") ||
        itemElement.querySelector(".brz-mega-menu__portal");

      if (submenu) {
        submenu.setAttribute("role", "menu");
      }
    }
  }

  private updateAriaExpanded(item: MenuItem, isOpen: boolean): void {
    if (!this.isExtendedMenuItem(item)) {
      return;
    }

    const linkElement = item.item.querySelector("a");
    if (linkElement) {
      linkElement.setAttribute("aria-expanded", isOpen.toString());
    }
  }

  private handleMouseDownOutside(event: MouseEvent) {
    if (
      event.target instanceof HTMLElement &&
      event.target.closest(".brz-menu__item")
    ) {
      return;
    }

    const activeItems = this.getActiveItems();
    if (!activeItems.length) {
      return;
    }

    activeItems.forEach((item) => {
      if (this.isExtendedMenuItem(item)) {
        item.api.close();
        this.updateAriaExpanded(item, false);
      }
    });
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Tab") {
      this.handleTab(event);
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      this.handleArrowNavigation(event);
    }

    if (event.key === "Escape") {
      this.handleEscape(event);
    }
  }

  private handleFocus(item: MenuItem) {
    if (this.isLinkItem(item)) {
      return;
    }
    item.api.open();
    this.updateAriaExpanded(item, true);
  }

  private handleFocusOut(item: MenuItem) {
    if (this.isLinkItem(item)) {
      return;
    }
  }

  private handleTab(event: KeyboardEvent) {
    if (event.key === "Tab") {
      // INFO: We need to setTimeout to ensure that the document.activeElement is set correctly
      setTimeout(() => {
        const nonActiveItems = this.menuItems.filter(
          (element) => !this.isActiveItem(element)
        );

        nonActiveItems.forEach((element) => {
          if (this.isExtendedMenuItem(element) && element.api.isOpen()) {
            element.api.close();
            this.updateAriaExpanded(element, false);
          }
        });
      }, 0);
    }
  }

  private handleArrowNavigation(event: KeyboardEvent) {
    const isArrowDown = event.key === "ArrowDown";
    const activeElement = document.activeElement;
    const activeItem = this.menuItems.find(
      (item) =>
        item.item === activeElement?.closest<HTMLElement>(".brz-menu__item")
    );

    if (!activeItem) {
      return;
    }

    if (this.isExtendedMenuItem(activeItem)) {
      const hasChildren = activeItem.children.length > 0;
      if (hasChildren) {
        const targetChildIndex = isArrowDown
          ? 0
          : activeItem.children.length - 1;
        const linkElement = this.getLinkElement({
          item: activeItem.children[targetChildIndex],
          type: "link"
        });
        if (linkElement) {
          linkElement.focus();
        }
      }
    } else {
      const parentItem =
        activeItem.item.closest<HTMLElement>(".brz-menu__item");
      const siblingItem = (
        isArrowDown
          ? parentItem?.nextElementSibling
          : parentItem?.previousElementSibling
      ) as HTMLElement | null;

      if (siblingItem) {
        const linkElement = this.getLinkElement({
          item: siblingItem,
          type: "link"
        });
        if (linkElement) {
          linkElement.focus();
        }
      }
    }
  }

  private handleEscape(event: KeyboardEvent) {
    if (event.key === "Escape") {
      const activeItems = this.getActiveItems();

      if (!activeItems.length) {
        return;
      }

      activeItems.forEach((item) => {
        if (this.isExtendedMenuItem(item)) {
          item.api.close();
          this.updateAriaExpanded(item, false);
        }
      });

      const linkElement = this.getLinkElement(activeItems[0]);
      if (linkElement) {
        linkElement.focus();
      }
    }
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

  private isLinkItem(item: MenuItem): item is LinkItem {
    return item.type === "link";
  }

  private isExtendedMenuItem(item: MenuItem): item is ExtendedMenuItem {
    return item.type !== "link";
  }

  private isActiveItem(item: MenuItem): boolean {
    return item.item.contains(document.activeElement);
  }

  private getActiveItems(): MenuItem[] {
    // This is used to get all nested dropdowns
    return this.menuItems.filter(this.isActiveItem);
  }

  private getLinkElement(item: MenuItem): HTMLElement | null {
    return item.item.querySelector("a");
  }
}
