interface FlipboxItemApi {
  open: VoidFunction;
  close: VoidFunction;
  toggle: VoidFunction;
  isOpen: () => boolean;
}

interface FlipboxAccessibilityItem {
  item: HTMLElement;
  front: HTMLElement;
  back: HTMLElement;
  api: FlipboxItemApi;
}

interface Options {
  item: FlipboxAccessibilityItem;
}

const storedTabindexAttribute = "data-brz-flipbox-tabindex";
export const focusableSelector = [
  "a[href]",
  "area[href]",
  "button",
  "input",
  "select",
  "textarea",
  "iframe",
  "summary",
  "audio[controls]",
  "video[controls]",
  "[contenteditable='true']",
  "[tabindex]"
].join(", ");

export class FlipboxAccessibility {
  private item: FlipboxAccessibilityItem;

  constructor({ item }: Options) {
    this.item = item;
  }

  public init(): void {
    this.initItem();
    this.item.item.addEventListener("keydown", this.handleKeyDown);
    this.sync();
  }

  public sync(): void {
    const isBackVisible = this.item.api.isOpen();
    const activePanel = isBackVisible ? this.item.back : this.item.front;
    const hasFocusableDescendants =
      activePanel.querySelector(focusableSelector) !== null;

    if (hasFocusableDescendants) {
      this.item.item.setAttribute("role", "group");
      this.item.item.setAttribute("aria-roledescription", "flipbox");
      this.item.item.removeAttribute("aria-pressed");
    } else {
      this.item.item.setAttribute("role", "button");
      this.item.item.setAttribute("aria-pressed", isBackVisible.toString());
      this.item.item.removeAttribute("aria-roledescription");
    }

    this.item.item.setAttribute("tabindex", "0");
    this.item.front.setAttribute("aria-hidden", isBackVisible.toString());
    this.item.back.setAttribute("aria-hidden", (!isBackVisible).toString());
    this.syncFocusableDescendants(this.item.front, !isBackVisible);
    this.syncFocusableDescendants(this.item.back, isBackVisible);
  }

  private initItem(): void {
    this.item.item.setAttribute("aria-keyshortcuts", "Enter Space");
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.target !== event.currentTarget) {
      return;
    }

    switch (event.key) {
      case "Enter":
      case " ":
      case "Spacebar":
        event.preventDefault();
        this.item.api.toggle();
        this.sync();
        break;
    }
  };

  private syncFocusableDescendants(
    container: HTMLElement,
    isActive: boolean
  ): void {
    container
      .querySelectorAll<HTMLElement>(focusableSelector)
      .forEach((element) => {
        if (isActive) {
          this.restoreTabindex(element);
        } else {
          this.disableTabindex(element);
        }
      });
  }

  private disableTabindex(element: HTMLElement): void {
    if (!element.hasAttribute(storedTabindexAttribute)) {
      element.setAttribute(
        storedTabindexAttribute,
        element.getAttribute("tabindex") ?? ""
      );
    }

    element.setAttribute("tabindex", "-1");
  }

  private restoreTabindex(element: HTMLElement): void {
    if (!element.hasAttribute(storedTabindexAttribute)) {
      return;
    }

    const previousTabindex =
      element.getAttribute(storedTabindexAttribute) ?? "";

    if (previousTabindex === "") {
      element.removeAttribute("tabindex");
    } else {
      element.setAttribute("tabindex", previousTabindex);
    }

    element.removeAttribute(storedTabindexAttribute);
  }
}
