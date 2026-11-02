/** Discriminated on `kind`: element-bound resolves items from a selector, global gets one `src`. */

/** The item currently shown by the lightbox. */
export interface LightboxItem {
  /** Resolved source: an image URL, an iframe URL, or a selector for `inline`. */
  src: string;
  type: LightboxType;
  index: number;
  /** For `type: "inline"`, the element moved into the lightbox and put back on close. */
  inlineElement: HTMLElement | undefined;
  /** The node the item was resolved from, when there is one. */
  sourceElement: HTMLElement | undefined;
}

/** Handed to every callback. */
export interface LightboxContext {
  currentItem: LightboxItem;
}

export type LightboxType = "image" | "inline" | "iframe";

export interface LightboxGalleryOptions {
  enabled: boolean;
}

export interface LightboxCallbacks {
  open: ((ctx: LightboxContext) => void) | undefined;
  close: ((ctx: LightboxContext) => void) | undefined;
}

export interface ElementLightboxOptions {
  type: "image";
  /** CSS selector, inside `target`, of the nodes that open the lightbox. */
  delegate: string;
  gallery: LightboxGalleryOptions | undefined;
  closeOnContentClick: boolean;
  /** Extra classes for the lightbox wrapper, space separated. */
  mainClass: string;
  callbacks: LightboxCallbacks;
}

export interface GlobalLightboxOptions {
  /** `inline` takes a selector for the element to lift, `iframe` takes a URL. */
  type: "inline" | "iframe";
  src: string;
  closeOnContentClick: boolean;
  mainClass: string;
  callbacks: LightboxCallbacks;
}

export type LightboxRequest =
  | {
      kind: "element";
      target: HTMLElement;
      options: ElementLightboxOptions;
    }
  | {
      kind: "global";
      options: GlobalLightboxOptions;
    };

export interface LightboxHandle {
  /** Builds the popup and shows the first item. */
  open: () => void;
  close: () => void;
  /** Only meaningful for a gallery; switches to `index` of the resolved items. */
  goTo: (index: number) => void;
}
