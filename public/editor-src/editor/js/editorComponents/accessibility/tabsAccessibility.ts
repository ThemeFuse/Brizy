interface TabsDesktopItem {
  item: HTMLElement;
  button: HTMLElement;
  panel: HTMLElement;
}

interface TabsMobileItem {
  header: HTMLElement;
  button: HTMLElement;
  panel: HTMLElement;
}

interface Options {
  desktopItems: TabsDesktopItem[];
  mobileItems: TabsMobileItem[];
  orientation: "horizontal" | "vertical";
}

type TabsKeyDownContext =
  | { mode: "desktop"; item: TabsDesktopItem }
  | { mode: "mobile"; item: TabsMobileItem };

export class TabsAccessibility {
  private desktopItems: TabsDesktopItem[];
  private mobileItems: TabsMobileItem[];
  private orientation: "horizontal" | "vertical";

  constructor({
    desktopItems,
    mobileItems,
    orientation
  }: Options) {
    this.desktopItems = desktopItems;
    this.mobileItems = mobileItems;
    this.orientation = orientation;
  }

  public init(): void {
    this.desktopItems.forEach((item) => {
      this.initDesktopItem(item);
      item.button.addEventListener("keydown", (event) =>
        this.handleKeyDown(event, { mode: "desktop", item })
      );
    });

    this.mobileItems.forEach((item) => {
      this.initMobileItem(item);
      item.button.addEventListener("keydown", (event) =>
        this.handleKeyDown(event, { mode: "mobile", item })
      );
    });

    this.sync();
  }

  public sync(): void {
    this.desktopItems.forEach((item) => {
      const isActive = item.item.classList.contains("brz-tabs__nav--active");

      item.button.setAttribute("aria-selected", String(isActive));
      item.button.setAttribute("tabindex", isActive ? "0" : "-1");
      item.panel.setAttribute("aria-hidden", String(!isActive));
    });

    this.mobileItems.forEach((item) => {
      const isActive = item.header.classList.contains("brz-tabs__nav--mobile--active");

      item.button.setAttribute("aria-expanded", String(isActive));
      item.panel.setAttribute("aria-hidden", String(!isActive));
    });
  }

  private initDesktopItem(item: TabsDesktopItem): void {
    const nav = item.item.parentElement;

    nav?.setAttribute("role", "tablist");
    nav?.setAttribute("aria-orientation", this.orientation);
    item.button.setAttribute("role", "tab");
  }

  private initMobileItem(item: TabsMobileItem): void {
    item.button.setAttribute("role", "button");
    item.button.setAttribute("tabindex", "0");
  }

  private handleKeyDown(
    event: KeyboardEvent,
    ctx: TabsKeyDownContext
  ): void {
    const { mode, item } = ctx;

    switch (event.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        event.preventDefault();
        item.button.click();
        break;
      case "ArrowRight":
        if (mode === "desktop" && this.orientation === "horizontal") {
          event.preventDefault();
          this.focusDesktopSibling(item, 1, true);
        } else if (mode === "mobile") {
          event.preventDefault();
          this.focusMobileSibling(item, 1);
        }
        break;
      case "ArrowLeft":
        if (mode === "desktop" && this.orientation === "horizontal") {
          event.preventDefault();
          this.focusDesktopSibling(item, -1, true);
        } else if (mode === "mobile") {
          event.preventDefault();
          this.focusMobileSibling(item, -1);
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (mode === "desktop") {
          this.focusDesktopSibling(item, 1, this.orientation === "vertical");
        } else {
          this.focusMobileSibling(item, 1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (mode === "desktop") {
          this.focusDesktopSibling(item, -1, this.orientation === "vertical");
        } else {
          this.focusMobileSibling(item, -1);
        }
        break;
      case "Home":
        event.preventDefault();
        if (mode === "desktop") {
          this.activateDesktopItem(this.desktopItems[0]);
        } else {
          this.mobileItems[0]?.button.focus();
        }
        break;
      case "End":
        event.preventDefault();
        if (mode === "desktop") {
          this.activateDesktopItem(
            this.desktopItems[this.desktopItems.length - 1]
          );
        } else {
          this.mobileItems[this.mobileItems.length - 1]?.button.focus();
        }
        break;
    }
  }

  private activateDesktopItem(item?: TabsDesktopItem): void {
    if (!item) {
      return;
    }

    item.button.focus();
    item.button.click();
  }

  private focusDesktopSibling(
    currentItem: TabsDesktopItem,
    direction: 1 | -1,
    activate: boolean
  ): void {
    const currentIndex = this.desktopItems.findIndex(
      ({ button }) => button === currentItem.button
    );

    if (currentIndex === -1) {
      return;
    }

    const nextIndex =
      (currentIndex + direction + this.desktopItems.length) %
      this.desktopItems.length;
    const nextItem = this.desktopItems[nextIndex];

    if (!nextItem) {
      return;
    }

    if (activate) {
      this.activateDesktopItem(nextItem);
      return;
    }

    nextItem.button.focus();
  }

  private focusMobileSibling(
    currentItem: TabsMobileItem,
    direction: 1 | -1
  ): void {
    const currentIndex = this.mobileItems.findIndex(
      ({ button }) => button === currentItem.button
    );

    if (currentIndex === -1) {
      return;
    }

    const nextIndex =
      (currentIndex + direction + this.mobileItems.length) %
      this.mobileItems.length;

    this.mobileItems[nextIndex]?.button.focus();
  }
}
