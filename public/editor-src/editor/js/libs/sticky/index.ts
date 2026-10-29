import { observer } from "./observer";

// The sticky check behind the published header, replacing the jQuery `brzSticky` plugin 1:1.

export type StickyType = "animated" | "fixed";

export interface StickySettings {
  type: StickyType;
  refNode: (element: HTMLElement) => HTMLElement | undefined;
  onStickyChange: (element: HTMLElement, isSticky: boolean) => void;
}

class StickyInstance {
  private readonly element: HTMLElement;
  private readonly settings: StickySettings;
  private isSticky = false;
  private hasEmittedInitial = false;

  constructor(element: HTMLElement, settings: StickySettings) {
    this.element = element;
    this.settings = settings;

    observer.addListener(() => this.checkSticky());
  }

  private checkSticky(): void {
    const { type } = this.settings;
    const refNode = this.settings.refNode(this.element);
    const view = this.element.ownerDocument.defaultView;

    if (!view) {
      throw new TypeError("sticky: the element's document has no window");
    }

    const scrollY = view.scrollY;

    if (!refNode) {
      throw new TypeError("sticky: the reference node was not found");
    }

    const refNodeRect = refNode.getBoundingClientRect();
    const isSticky =
      type === "animated"
        ? -refNodeRect.top >= refNodeRect.height
        : refNodeRect.top <= 0;

    if (scrollY >= 0) {
      const shouldEmit = isSticky !== this.isSticky || !this.hasEmittedInitial;

      if (shouldEmit) {
        this.hasEmittedInitial = true;
        this.isSticky = isSticky;
        if (type === "animated") {
          if (this.isSticky) {
            this.element.removeAttribute("aria-hidden");
            this.element.removeAttribute("inert");
          } else {
            this.element.setAttribute("aria-hidden", "true");
            this.element.setAttribute("inert", "");
          }
        }
        this.settings.onStickyChange(this.element, this.isSticky);
      }
    }
  }
}

const instances = new WeakMap<HTMLElement, StickyInstance>();

// Watches the element; an element that is already watched keeps its settings.
export function sticky(element: HTMLElement, settings: StickySettings): void {
  if (!instances.has(element)) {
    instances.set(element, new StickyInstance(element, settings));
  }
}
