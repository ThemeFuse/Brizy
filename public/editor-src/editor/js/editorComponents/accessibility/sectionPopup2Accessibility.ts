import $ from "jquery";
import { makeAttr } from "visual/utils/i18n/attribute";

const clickOutsideAttr = makeAttr("click_outside_to_close");
const oldClickOutsideAttr = "data-click_outside_to_close";

const isTruthyAttr = (value: string | null): boolean =>
  value === "true" || value === "1" || value === "on";

const setButtonLike = (el: HTMLElement): void => {
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      event.preventDefault();
      el.click();
    }
  });
};

export class SectionPopup2Accessibility {
  private root: HTMLElement;
  private onDocKeyDown: ((e: KeyboardEvent) => void) | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  public init(): void {
    // Basic dialog semantics
    this.root.setAttribute("role", "dialog");
    this.root.setAttribute("aria-modal", "true");
    this.root.setAttribute("tabindex", "-1");
    this.root.setAttribute("aria-hidden", (!this.isOpened()).toString());

    // Ensure close affordances are keyboard accessible
    this.root
      .querySelectorAll<HTMLElement>(
        ".brz-popup2__close, .brz-popup2__action-close"
      )
      .forEach((el) => {
        setButtonLike(el);
        el.setAttribute("aria-label", "Close popup");
      });

    // Keep aria-hidden in sync with open/close
    window.Brz?.on?.("elements.popup.open", (node: HTMLElement) => {
      if (node === this.root) {
        this.onOpen();
      }
    });

    window.Brz?.on?.("elements.popup.close", (node: HTMLElement) => {
      if (node === this.root) {
        this.onClose();
      }
    });

    // In case it is already opened on init
    if (this.isOpened()) {
      this.onOpen();
    }
  }

  private isOpened(): boolean {
    return this.root.classList.contains("brz-popup2--opened");
  }

  private canCloseWithEsc(): boolean {
    const attr =
      this.root.getAttribute(clickOutsideAttr) ??
      this.root.getAttribute(oldClickOutsideAttr);
    return isTruthyAttr(attr);
  }

  private onOpen(): void {
    this.root.setAttribute("aria-hidden", "false");

    // Focus dialog for screen readers / keyboard users
    requestAnimationFrame(() => {
      this.root.focus({ preventScroll: true });
    });

    // ESC should only close when click-outside-to-close option is ON
    if (!this.canCloseWithEsc()) {
      return;
    }

    if (this.onDocKeyDown) {
      return;
    }

    this.onDocKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!this.isOpened()) return;

      event.preventDefault();
      const popup = $(this.root).popup();

      if (popup && typeof popup.close === "function") {
        popup.close();
      }
    };

    document.addEventListener("keydown", this.onDocKeyDown, true);
  }

  private onClose(): void {
    this.root.setAttribute("aria-hidden", "true");

    if (this.onDocKeyDown) {
      document.removeEventListener("keydown", this.onDocKeyDown, true);
      this.onDocKeyDown = null;
    }
  }
}
