import type {
  LightboxCallbacks,
  LightboxContext,
  LightboxHandle,
  LightboxItem,
  LightboxRequest,
  LightboxType
} from "./types";

const PREFIX = "brz-lb-";

const CLASS = {
  wrap: `${PREFIX}wrap`,
  gallery: `${PREFIX}gallery`,
  closeBtnIn: `${PREFIX}close-btn-in`,
  autoCursor: `${PREFIX}auto-cursor`,
  container: `${PREFIX}container`,
  content: `${PREFIX}content`,
  preloader: `${PREFIX}preloader`,
  figure: `${PREFIX}figure`,
  loading: `${PREFIX}loading`,
  imageHolder: `${PREFIX}image-holder`,
  inlineHolder: `${PREFIX}inline-holder`,
  iframeHolder: `${PREFIX}iframe-holder`,
  iframeScaler: `${PREFIX}iframe-scaler`,
  img: `${PREFIX}img`,
  iframe: `${PREFIX}iframe`,
  bottomBar: `${PREFIX}bottom-bar`,
  title: `${PREFIX}title`,
  counter: `${PREFIX}counter`,
  close: `${PREFIX}close`,
  arrow: `${PREFIX}arrow`,
  arrowLeft: `${PREFIX}arrow-left`,
  arrowRight: `${PREFIX}arrow-right`,
  preventClose: `${PREFIX}prevent-close`,
  bg: `${PREFIX}bg`,
  hide: `${PREFIX}hide`
};

const STATUS_CLASS = {
  loading: `${PREFIX}s-loading`,
  ready: `${PREFIX}s-ready`,
  error: `${PREFIX}s-error`
};

type Status = keyof typeof STATUS_CLASS;

const HOLDER_CLASS: Record<LightboxType, string> = {
  image: CLASS.imageHolder,
  inline: CLASS.inlineHolder,
  iframe: CLASS.iframeHolder
};

const T_LOADING = "Loading...";
const T_IMAGE_ERROR = "The image could not be loaded.";
const T_NOT_FOUND = "Content not found";
const T_CLOSE = "Close (Esc)";
const T_PREV = "Previous (Left arrow key)";
const T_NEXT = "Next (Right arrow key)";

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;

  return node;
};

const button = (className: string, title: string, label: string): HTMLButtonElement => {
  // The snapshots pin the serialised markup, so the attribute order here is deliberate.
  const node = document.createElement("button");
  node.title = title;
  node.type = "button";
  node.className = className;
  node.textContent = label;

  return node;
};

const viewportHeight = (): number => document.documentElement.clientHeight;

const names = (...parts: (string | false)[]): string => parts.filter(Boolean).join(" ");

interface ResolvedOptions {
  type: LightboxType;
  closeOnContentClick: boolean;
  mainClass: string;
  callbacks: LightboxCallbacks;
  gallery: boolean;
}

/** Shared by every instance, so any of them can put back an element that was lifted out. */
let lifted: { element: HTMLElement; placeholder: HTMLElement } | undefined;
let placeholder: HTMLElement | undefined;

const putInlineElementBack = (): void => {
  if (!lifted) {
    return;
  }

  const { element, placeholder: marker } = lifted;

  marker.after(element);
  element.classList.add(CLASS.hide);
  element.querySelector(`.${CLASS.close}`)?.remove();
  marker.remove();
  lifted = undefined;
};

/** The open popup: opening a second one closes the first. */
let live: Lightbox | undefined;

class Lightbox {
  private request: LightboxRequest;

  private isOpen = false;

  private items: LightboxItem[] = [];

  private index = 0;

  private wrap = document.createElement("div");

  private bg = document.createElement("div");

  private container = document.createElement("div");

  private contentContainer = document.createElement("div");

  /** Built once per open and reused for every image of the gallery. */
  private imageFigure = document.createElement("div");

  /** The `<figure>` inside `imageFigure` whose children are replaced on every render. */
  private imageContent = document.createElement("figure");

  private preloader = document.createElement("div");

  private content: HTMLElement | undefined;

  private lastFocused: HTMLElement | undefined;

  private onKeyDown: ((event: KeyboardEvent) => void) | undefined;

  private onKeyUp: ((event: KeyboardEvent) => void) | undefined;

  private onWrapClick: ((event: MouseEvent) => void) | undefined;

  private onResize: (() => void) | undefined;

  constructor(request: LightboxRequest) {
    this.request = request;
  }

  open = (): void => {
    live?.close();
    live = this;

    this.items = this.resolveItems();
    this.buildShell();
    this.lockScrolling();
    document.body.prepend(this.bg, this.wrap);

    const active = document.activeElement;

    this.lastFocused = active instanceof HTMLElement ? active : undefined;
    this.render(this.index);

    if (this.items.length > 1) {
      this.renderArrows();
    }

    this.startListening();
    this.isOpen = true;
    this.wrap.focus();
    this.options.callbacks.open?.(this.context());
  };

  close = (): void => {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    putInlineElementBack();
    this.stopListening();
    this.resetIframe();
    this.options.callbacks.close?.(this.context());

    this.wrap.remove();
    this.bg.remove();
    this.unlockScrolling();

    if (live === this) {
      live = undefined;
    }

    this.lastFocused?.focus();
    this.lastFocused = undefined;
  };

  goTo = (index: number): void => {
    if (index === this.index || this.items.length < 2) {
      return;
    }

    this.render(index);
  };

  private get options(): ResolvedOptions {
    const { type, closeOnContentClick, mainClass, callbacks } = this.request.options;

    if (this.request.kind === "element") {
      return {
        type,
        closeOnContentClick,
        mainClass,
        callbacks,
        gallery: this.request.options.gallery?.enabled === true
      };
    }

    return { type, closeOnContentClick, mainClass, callbacks, gallery: false };
  }

  private context(): LightboxContext {
    return { currentItem: this.items[this.index] };
  }

  private resolveItems(): LightboxItem[] {
    if (this.request.kind === "global") {
      return [
        {
          src: this.request.options.src,
          type: this.request.options.type,
          index: 0,
          inlineElement: undefined,
          sourceElement: undefined
        }
      ];
    }

    const { target, options } = this.request;

    return [...target.querySelectorAll<HTMLElement>(options.delegate)].map((element, index) => ({
      src: element.getAttribute("href") ?? "",
      type: options.type,
      index,
      inlineElement: undefined,
      sourceElement: element
    }));
  }

  private buildShell(): void {
    const { gallery, closeOnContentClick, mainClass } = this.options;

    this.wrap = el(
      "div",
      names(
        CLASS.wrap,
        gallery && CLASS.gallery,
        CLASS.closeBtnIn,
        !closeOnContentClick && CLASS.autoCursor,
        mainClass
      ),
      ""
    );
    this.wrap.tabIndex = -1;
    this.wrap.style.overflow = "auto";
    this.wrap.style.overflowX = "hidden";
    this.wrap.style.overflowY = "auto";

    this.bg = el("div", names(CLASS.bg, mainClass), "");
    this.bg.addEventListener("click", this.close);

    this.imageFigure = el("div", CLASS.figure, "");
    this.imageContent = document.createElement("figure");
    this.imageFigure.append(this.closeButton(), this.imageContent);

    this.container = el("div", CLASS.container, "");
    this.contentContainer = el("div", CLASS.content, "");
    this.preloader = el("div", CLASS.preloader, T_LOADING);
    this.container.append(this.contentContainer, this.preloader);
    this.wrap.append(this.container);
  }

  private render(index: number): void {
    const item = this.items[index];

    if (!item) {
      return;
    }

    this.index = index;
    this.container.className = names(CLASS.container, STATUS_CLASS.loading);

    this.content = item.type === "image" ? this.renderImage(item) : this.renderEmbedded(item);
    this.contentContainer.replaceChildren(this.content);
    this.container.classList.add(HOLDER_CLASS[item.type]);
  }

  private renderImage(item: LightboxItem): HTMLElement {
    const figure = this.imageFigure;
    const caption = document.createElement("figcaption");
    const bar = el("div", CLASS.bottomBar, "");
    const image = document.createElement("img");
    const source = item.sourceElement;

    image.className = CLASS.img;
    image.setAttribute("alt", source?.querySelector("img")?.getAttribute("alt") ?? "");
    image.setAttribute("src", item.src);
    this.fit(image);

    bar.append(el("div", CLASS.title, source?.getAttribute("title") ?? ""));
    bar.append(el("div", CLASS.counter, this.counter()));
    caption.append(bar);

    // Only the image and its caption are replaced; the figure keeps its controls.
    this.imageContent.replaceChildren(image, caption);
    figure.classList.add(CLASS.loading);

    image.addEventListener("load", () => this.imageSettled(item, figure, "ready"));
    image.addEventListener("error", () => this.imageSettled(item, figure, "error"));
    image.addEventListener("click", (event) => {
      if (this.items.length < 2) {
        return;
      }

      event.stopPropagation();
      this.next();
    });

    // A cached image never fires `load`, so its size has to be read here.
    if (image.complete && image.naturalWidth > 0) {
      this.imageSettled(item, figure, "ready");
    }

    return figure;
  }

  private renderEmbedded(item: LightboxItem): HTMLElement {
    return item.type === "iframe" ? this.renderIframe(item) : this.renderInline(item);
  }

  private renderInline(item: LightboxItem): HTMLElement {
    putInlineElementBack();

    const element = document.querySelector<HTMLElement>(item.src);

    if (!element) {
      this.setStatus("error", T_NOT_FOUND);

      return el("div", "", "");
    }

    if (element.parentElement) {
      if (!placeholder) {
        placeholder = el("div", CLASS.hide, "");
      }

      element.after(placeholder);
      lifted = { element, placeholder };
      element.classList.remove(CLASS.hide);
    }

    element.append(this.closeButton());
    item.inlineElement = element;
    this.setStatus("ready", "");

    return element;
  }

  private renderIframe(item: LightboxItem): HTMLElement {
    const scaler = el("div", CLASS.iframeScaler, "");
    const iframe = document.createElement("iframe");

    iframe.className = CLASS.iframe;
    iframe.setAttribute("src", item.src);
    iframe.setAttribute("frameborder", "0");
    iframe.allowFullscreen = true;

    scaler.append(this.closeButton(), iframe);
    this.setStatus("ready", "");

    return scaler;
  }

  private renderArrows(): void {
    this.container.append(
      button(names(CLASS.arrow, CLASS.arrowLeft, CLASS.preventClose), T_PREV, ""),
      button(names(CLASS.arrow, CLASS.arrowRight, CLASS.preventClose), T_NEXT, "")
    );

    this.container.querySelector(`.${CLASS.arrowLeft}`)?.addEventListener("click", this.previous);
    this.container
      .querySelector(`.${CLASS.arrowRight}`)
      ?.addEventListener("click", this.next);
  }

  private closeButton(): HTMLButtonElement {
    const close = button(CLASS.close, T_CLOSE, "×");

    close.addEventListener("click", this.close);

    return close;
  }

  private counter(): string {
    if (this.items.length < 2) {
      return "";
    }

    return `${this.index + 1} of ${this.items.length}`;
  }

  private next = (): void => {
    if (this.items.length < 2) {
      return;
    }

    this.render((this.index + 1) % this.items.length);
  };

  private previous = (): void => {
    if (this.items.length < 2) {
      return;
    }

    this.render((this.index - 1 + this.items.length) % this.items.length);
  };

  private imageSettled(item: LightboxItem, figure: HTMLElement, status: Status): void {
    if (this.items[this.index] !== item) {
      return;
    }

    figure.classList.remove(CLASS.loading);
    this.setStatus(status, status === "error" ? T_IMAGE_ERROR : "");
  }

  private setStatus(status: Status, text: string): void {
    for (const name of Object.values(STATUS_CLASS)) {
      this.container.classList.remove(name);
    }

    this.container.classList.add(STATUS_CLASS[status]);

    // Nothing to say means nothing to write, so a ready popup keeps its initial text.
    if (text !== "") {
      this.preloader.textContent = text;
    }
  }

  private fit(image: HTMLImageElement): void {
    image.style.maxHeight = `${viewportHeight()}px`;
  }

  private resetIframe(): void {
    this.content
      ?.querySelector<HTMLIFrameElement>(`.${CLASS.iframe}`)
      ?.setAttribute("src", "//about:blank");
  }

  private startListening(): void {
    this.onWrapClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.closest(`.${CLASS.preventClose}`)) {
        return;
      }

      if (this.options.closeOnContentClick) {
        this.close();

        return;
      }

      if (target.closest(`.${CLASS.close}`) || target === this.preloader) {
        this.close();

        return;
      }

      if (this.content && !this.content.contains(target)) {
        this.close();
      }
    };

    this.wrap.addEventListener("click", this.onWrapClick);

    this.onKeyUp = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        this.close();
      }
    };

    document.addEventListener("keyup", this.onKeyUp);

    if (this.options.gallery) {
      this.onKeyDown = (event: KeyboardEvent) => {
        if (event.keyCode === 37) {
          this.previous();
        } else if (event.keyCode === 39) {
          this.next();
        }
      };

      document.addEventListener("keydown", this.onKeyDown);
    }

    this.onResize = () => {
      const image = this.content?.querySelector<HTMLImageElement>(`.${CLASS.img}`);

      if (image) {
        this.fit(image);
      }
    };

    window.addEventListener("resize", this.onResize);
  }

  private stopListening(): void {
    if (this.onWrapClick) {
      this.wrap.removeEventListener("click", this.onWrapClick);
    }

    if (this.onKeyUp) {
      document.removeEventListener("keyup", this.onKeyUp);
    }

    if (this.onKeyDown) {
      document.removeEventListener("keydown", this.onKeyDown);
    }

    if (this.onResize) {
      window.removeEventListener("resize", this.onResize);
    }

    this.onWrapClick = undefined;
    this.onKeyUp = undefined;
    this.onKeyDown = undefined;
    this.onResize = undefined;
  }

  private lockScrolling(): void {
    document.documentElement.style.overflow = "hidden";

    // The page just lost its scrollbar; without this margin the page jumps sideways.
    if (document.body.scrollHeight > viewportHeight()) {
      document.documentElement.style.marginRight = `${this.scrollbarWidth()}px`;
    }
  }

  private unlockScrolling(): void {
    document.documentElement.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("margin-right");
  }

  private scrollbarWidth(): number {
    const probe = el("div", "", "");

    probe.style.cssText = "position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll";
    document.body.append(probe);
    const width = probe.offsetWidth - probe.clientWidth;
    probe.remove();

    return width;
  }
}

export const openLightbox = (request: LightboxRequest): LightboxHandle => new Lightbox(request);
