export interface AccordionItemApi {
  open: VoidFunction;
  close: VoidFunction;
  toggle: VoidFunction;
  isOpen: () => boolean;
}

export interface AccordionAccessibilityItem {
  item: HTMLElement;
  button: HTMLElement;
  panel: HTMLElement;
  api: AccordionItemApi;
  keepOnePanelOpen: boolean;
}

interface Options {
  items: AccordionAccessibilityItem[];
  filterButtons?: HTMLElement[];
}

export class AccordionAccessibility {
  private items: AccordionAccessibilityItem[];
  private filterButtons: HTMLElement[];

  constructor({ items, filterButtons = [] }: Options) {
    this.items = items;
    this.filterButtons = filterButtons;
  }

  public init(): void {
    this.items.forEach((item) => {
      this.initHeader(item);
      item.button.addEventListener("keydown", (event) =>
        this.handleHeaderKeyDown(event, item)
      );
    });

    this.filterButtons.forEach((button) => {
      this.initFilterButton(button);
      button.addEventListener("keydown", (event) =>
        this.handleFilterKeyDown(event, button)
      );
    });

    this.sync();
  }

  public sync(): void {
    this.items.forEach((item) => this.syncItem(item));
    this.syncFilterButtons();
  }

  public syncFilterButtons(): void {
    this.filterButtons.forEach((button) => {
      const filterItem = button.closest(".brz-accordion__filter__item");
      const isActive =
        filterItem?.classList.contains("brz-accordion__filter__item--active") ??
        false;

      button.setAttribute("aria-pressed", isActive.toString());
    });
  }

  private initHeader(item: AccordionAccessibilityItem): void {
    item.button.setAttribute("role", "button");
    item.button.setAttribute("tabindex", "0");
  }

  private initFilterButton(button: HTMLElement): void {
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
  }

  private syncItem(item: AccordionAccessibilityItem): void {
    const isExpanded = item.api.isOpen();
    const isDisabled = item.keepOnePanelOpen && isExpanded;

    item.button.setAttribute("aria-expanded", isExpanded.toString());
    item.button.setAttribute("aria-disabled", isDisabled.toString());
    item.panel.setAttribute("aria-hidden", (!isExpanded).toString());
  }

  private handleHeaderKeyDown(
    event: KeyboardEvent,
    currentItem: AccordionAccessibilityItem
  ): void {
    switch (event.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        event.preventDefault();
        currentItem.button.click();
        break;
      case "ArrowDown":
        event.preventDefault();
        this.focusSibling(currentItem, 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.focusSibling(currentItem, -1);
        break;
      case "Home":
        event.preventDefault();
        this.items[0]?.button.focus();
        break;
      case "End":
        event.preventDefault();
        this.items[this.items.length - 1]?.button.focus();
        break;
    }
  }

  private focusSibling(
    currentItem: AccordionAccessibilityItem,
    direction: 1 | -1
  ): void {
    const currentIndex = this.items.findIndex(
      ({ button }) => button === currentItem.button
    );

    if (currentIndex === -1) {
      return;
    }

    const nextIndex =
      (currentIndex + direction + this.items.length) % this.items.length;

    this.items[nextIndex]?.button.focus();
  }

  private focusFilterSibling(
    currentButton: HTMLElement,
    direction: 1 | -1
  ): void {
    const currentIndex = this.filterButtons.findIndex(
      (button) => button === currentButton
    );

    if (currentIndex === -1) {
      return;
    }

    const nextIndex =
      (currentIndex + direction + this.filterButtons.length) %
      this.filterButtons.length;

    this.filterButtons[nextIndex]?.focus();
  }

  private handleFilterKeyDown(
    event: KeyboardEvent,
    button: HTMLElement
  ): void {
    switch (event.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        event.preventDefault();
        button.click();
        break;
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        this.focusFilterSibling(button, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        this.focusFilterSibling(button, -1);
        break;
      case "Home":
        event.preventDefault();
        this.filterButtons[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        this.filterButtons[this.filterButtons.length - 1]?.focus();
        break;
    }
  }
}
