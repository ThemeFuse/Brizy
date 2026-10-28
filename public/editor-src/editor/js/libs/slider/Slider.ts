// The published-page slider: builds the `.slick-*` markup and fires its events, without jQuery.

import { SliderAccessibility } from "./accessibility";
import { animate, animateValue } from "./animate";
import { measure, setSize, setStyle, setStyles, viewportSize } from "./dimensions";
import {
  add,
  addClass,
  atLeast,
  atMost,
  type Count,
  elementsOf,
  eq,
  greaterThan,
  hide,
  isMarkup,
  lessThan,
  looselyEqual,
  nodesOf,
  parse,
  removeAttributes,
  removeClass,
  setAttributes,
  show,
  slice
} from "./dom";
import { emitSliderEvent, onSlider } from "./events";
import { touchesSchema } from "./schemas";
import type {
  SliderBreakpointSettings,
  SliderEventName,
  SliderHandle,
  SliderOptions
} from "./types";

const Z_INDEX = 1000;
const EDGE_FRICTION = 0.35;
const CSS_EASE = "ease";

let instanceUid = 0;

/** What a gesture has recorded so far; every field may be absent. */
interface TouchState {
  fingerCount?: number;
  minSwipe?: number;
  startX?: number;
  startY?: number;
  curX?: number;
  curY?: number;
  swipeLength?: number;
  edgeHit?: boolean;
}

type Message =
  | { message: "previous" }
  | { message: "next" }
  | { message: "index"; index: number | undefined };

type SwipeAction = "start" | "move" | "end";

const defaultPaging = (doc: Document, index: number): Node[] => {
  const button = doc.createElement("button");

  button.setAttribute("type", "button");
  button.textContent = String(index + 1);

  return [button];
};

const children = (element: Element, selector: string | undefined): HTMLElement[] =>
  Array.from(element.children).flatMap((child) =>
    child instanceof HTMLElement && (!selector || child.matches(selector))
      ? [child]
      : []
  );

const find = (element: ParentNode, selector: string): HTMLElement[] =>
  Array.from(element.querySelectorAll<HTMLElement>(selector));

/** Position among its element siblings, `-1` without an element. */
const siblingIndex = (element: Element | undefined): number => {
  if (!element) {
    return -1;
  }

  let index = 0;
  let sibling = element.previousElementSibling;

  while (sibling) {
    index++;
    sibling = sibling.previousElementSibling;
  }

  return index;
};

function mergeBreakpoint(
  original: SliderOptions,
  settings: SliderBreakpointSettings
): SliderOptions {
  const merged: SliderOptions = { ...original };

  if (settings.slidesToShow !== undefined) {
    merged.slidesToShow = settings.slidesToShow;
  }
  if (settings.slidesToScroll !== undefined) {
    merged.slidesToScroll = settings.slidesToScroll;
  }
  if (settings.centerPadding !== undefined) {
    merged.centerPadding = settings.centerPadding;
  }
  if (settings.speed !== undefined) {
    merged.speed = settings.speed;
  }

  return merged;
}

export class Slider implements SliderHandle {
  private readonly slider: HTMLElement;
  private readonly doc: Document;
  private readonly win: Window;
  private readonly instanceUid: number;

  private options: SliderOptions;
  private readonly originalSettings: SliderOptions;

  // Reset on every refresh.
  private animating = false;
  private dragging = false;
  private autoPlayTimer: number | undefined = undefined;
  private currentLeft = 0;
  private currentSlide = 0;
  private direction = 1;
  private dots: HTMLElement | undefined = undefined;
  private listWidth = 0;
  private nextArrow: Node[] | undefined = undefined;
  private prevArrow: Node[] | undefined = undefined;
  private scrolling = false;
  private slideCount = 0;
  private slideWidth = 0;
  private trackElement: HTMLElement | undefined = undefined;
  private slides: HTMLElement[] | undefined = undefined;
  private slideOffset = 0;
  private swipeLeft: number | undefined = undefined;
  private swiping = false;
  private listElement: HTMLElement | undefined = undefined;
  private touch: TouchState = {};
  private transformsEnabled = false;
  private unslicked = false;

  private activeBreakpoint: number | undefined = undefined;
  private animType: string | false | undefined = undefined;
  private readonly breakpoints: number[] = [];
  private readonly breakpointSettings = new Map<number, SliderBreakpointSettings>();
  private cssTransitions = false;
  private focussed = false;
  private interrupted = false;
  private readonly hidden: string;
  private paused = true;
  private positionProp: "left" | "top" = "left";
  private shouldClick = true;
  private transformType = "";
  private transitionType = "";
  private readonly visibilityChange: string;
  private windowWidth = 0;
  private windowDelay: number | undefined = undefined;
  private readonly originalStyling = new WeakMap<HTMLElement, string>();

  // Listener groups, removed together.
  private arrowEvents = new AbortController();
  private dotEvents = new AbortController();
  private slideEvents = new AbortController();
  private listEvents = new AbortController();
  private focusEvents = new AbortController();
  private selectEvents = new AbortController();
  private windowEvents = new AbortController();
  private dragEvents = new AbortController();
  private documentEvents = new AbortController();

  constructor(element: HTMLElement, options: SliderOptions) {
    this.slider = element;
    this.doc = element.ownerDocument;
    this.win = this.doc.defaultView ?? window;
    this.options = { ...options };
    this.originalSettings = this.options;

    if (Reflect.get(this.doc, "mozHidden") !== undefined) {
      this.hidden = "mozHidden";
      this.visibilityChange = "mozvisibilitychange";
    } else if (Reflect.get(this.doc, "webkitHidden") !== undefined) {
      this.hidden = "webkitHidden";
      this.visibilityChange = "webkitvisibilitychange";
    } else {
      this.hidden = "hidden";
      this.visibilityChange = "visibilitychange";
    }

    this.instanceUid = instanceUid++;

    this.registerBreakpoints();
  }

  // --- public handle --------------------------------------------------------------------------

  on: SliderHandle["on"] = (name, listener): void => {
    onSlider(this.slider, name, listener);
  };

  mount = (): void => {
    this.init(true);
  };

  play = (): void => {
    this.autoPlay();
    this.options.autoplay = true;
    this.paused = false;
    this.focussed = false;
    this.interrupted = false;
  };

  pause = (): void => {
    this.autoPlayClear();
    this.paused = true;
  };

  goTo = (index: number): void => {
    this.changeSlide(
      { message: "index", index: Number.parseInt(String(index)) },
      undefined,
      false
    );
  };

  next = (): void => {
    this.changeSlide({ message: "next" }, undefined, false);
  };

  prev = (): void => {
    this.changeSlide({ message: "previous" }, undefined, false);
  };

  setPosition = (): void => {
    this.setDimensions();

    if (this.options.fade === false) {
      this.setCSS(this.getLeft(this.currentSlide));
    } else {
      this.setFade();
    }

    this.trigger("setPosition", this.currentSlide);
  };

  setupAccessibility: SliderHandle["setupAccessibility"] = (options): void => {
    new SliderAccessibility(this.slider, this, options).init();
  };

  // --- internals ------------------------------------------------------------------------------

  private get track(): HTMLElement {
    if (!this.trackElement) {
      throw new Error("The slider track is not built");
    }
    return this.trackElement;
  }

  private get list(): HTMLElement {
    if (!this.listElement) {
      throw new Error("The slider list is not built");
    }
    return this.listElement;
  }

  private get ownSlides(): HTMLElement[] {
    return this.slides ?? [];
  }

  private trigger(name: SliderEventName, nextSlide: number): void {
    emitSliderEvent(this.slider, name, {
      slides: [...this.ownSlides],
      currentSlide: this.currentSlide,
      nextSlide
    });
  }

  private resetInitials(currentSlide: number): void {
    this.animating = false;
    this.dragging = false;
    this.autoPlayTimer = undefined;
    this.currentLeft = 0;
    this.currentSlide = currentSlide;
    this.direction = 1;
    this.dots = undefined;
    this.listWidth = 0;
    this.nextArrow = undefined;
    this.prevArrow = undefined;
    this.scrolling = false;
    this.slideCount = 0;
    this.slideWidth = 0;
    this.trackElement = undefined;
    this.slides = undefined;
    this.slideOffset = 0;
    this.swipeLeft = undefined;
    this.swiping = false;
    this.listElement = undefined;
    this.touch = {};
    this.transformsEnabled = false;
    this.unslicked = false;
  }

  private activateADA(): void {
    const active = find(this.track, ".slick-active");

    setAttributes(active, { "aria-hidden": "false" });
    setAttributes(
      active.flatMap((slide) => find(slide, "a, input, button, select")),
      { tabindex: "0" }
    );
  }

  private animateSlide(target: number, callback: () => void): void {
    let targetLeft = target;

    if (this.options.rtl === true && this.options.vertical === false) {
      targetLeft = -targetLeft;
    }

    if (this.transformsEnabled === false) {
      animate(
        this.track,
        this.options.vertical === false ? { left: targetLeft } : { top: targetLeft },
        this.options.speed,
        callback
      );
      return;
    }

    const animType = this.animType;

    if (typeof animType !== "string") {
      return;
    }

    if (this.cssTransitions === false) {
      if (this.options.rtl === true) {
        this.currentLeft = -this.currentLeft;
      }
      animateValue(
        this.win,
        this.currentLeft,
        targetLeft,
        this.options.speed,
        (value) => {
          const now = Math.ceil(value);

          setStyle(
            this.track,
            animType,
            this.options.vertical === false
              ? `translate(${now}px, 0px)`
              : `translate(0px,${now}px)`
          );
        },
        callback
      );
      return;
    }

    this.applyTransition(undefined);
    targetLeft = Math.ceil(targetLeft);

    setStyle(
      this.track,
      animType,
      this.options.vertical === false
        ? `translate3d(${targetLeft}px, 0px, 0px)`
        : `translate3d(0px,${targetLeft}px, 0px)`
    );

    this.win.setTimeout(() => {
      this.disableTransition(undefined);
      callback();
    }, this.options.speed);
  }

  private applyTransition(slide: number | undefined): void {
    const value =
      this.options.fade === false
        ? `${this.transformType} ${this.options.speed}ms ${CSS_EASE}`
        : `opacity ${this.options.speed}ms ${CSS_EASE}`;

    if (this.options.fade === false) {
      setStyle(this.track, this.transitionType, value);
    } else {
      const target = slide === undefined ? undefined : eq(this.ownSlides, slide);

      if (target) {
        setStyle(target, this.transitionType, value);
      }
    }
  }

  private autoPlay(): void {
    this.autoPlayClear();

    if (greaterThan(this.slideCount, this.options.slidesToShow)) {
      this.autoPlayTimer = this.win.setInterval(
        this.autoPlayIterator,
        this.options.autoplaySpeed
      );
    }
  }

  private autoPlayClear(): void {
    if (this.autoPlayTimer) {
      this.win.clearInterval(this.autoPlayTimer);
    }
  }

  private autoPlayIterator = (): void => {
    let slideTo = this.currentSlide + this.options.slidesToScroll;

    if (!this.paused && !this.interrupted && !this.focussed) {
      if (this.options.infinite === false) {
        if (this.direction === 1 && this.currentSlide + 1 === this.slideCount - 1) {
          this.direction = 0;
        } else if (this.direction === 0) {
          slideTo = this.currentSlide - this.options.slidesToScroll;

          if (this.currentSlide - 1 === 0) {
            this.direction = 1;
          }
        }
      }

      this.slideHandler(slideTo, false, false);
    }
  };

  private buildArrows(): void {
    if (this.options.arrows !== true) {
      return;
    }

    this.prevArrow = nodesOf(this.options.prevArrow, this.doc);
    this.nextArrow = nodesOf(this.options.nextArrow, this.doc);
    addClass(this.prevArrow, "slick-arrow");
    addClass(this.nextArrow, "slick-arrow");

    if (greaterThan(this.slideCount, this.options.slidesToShow)) {
      removeClass(this.prevArrow, "slick-hidden");
      removeAttributes(this.prevArrow, "aria-hidden tabindex");
      removeClass(this.nextArrow, "slick-hidden");
      removeAttributes(this.nextArrow, "aria-hidden tabindex");

      if (isMarkup(this.options.prevArrow)) {
        this.slider.prepend(...this.prevArrow);
      }

      if (isMarkup(this.options.nextArrow)) {
        this.slider.append(...this.nextArrow);
      }

      if (this.options.infinite !== true) {
        addClass(this.prevArrow, "slick-disabled");
        setAttributes(this.prevArrow, { "aria-disabled": "true" });
      }
    } else {
      const both = [...this.prevArrow, ...this.nextArrow];

      addClass(both, "slick-hidden");
      setAttributes(both, { "aria-disabled": "true", tabindex: "-1" });
    }
  }

  private buildDots(): void {
    if (!(this.options.dots === true && greaterThan(this.slideCount, this.options.slidesToShow))) {
      return;
    }

    this.slider.classList.add("slick-dotted");

    const dot = this.doc.createElement("ul");

    addClass([dot], this.options.dotsClass);

    const { customPaging } = this.options;

    for (let i = 0; i <= this.getDotCount(); i += 1) {
      const item = this.doc.createElement("li");

      item.append(...(customPaging ? parse(customPaging(i), this.doc) : defaultPaging(this.doc, i)));
      dot.append(item);
    }

    this.slider.append(dot);
    this.dots = dot;
    children(dot, "li")[0]?.classList.add("slick-active");
  }

  private buildOut(): void {
    const slides = children(this.slider, ":not(.slick-cloned)");

    slides.forEach((slide) => slide.classList.add("slick-slide"));
    this.slides = slides;
    this.slideCount = slides.length;

    slides.forEach((slide, index) => {
      slide.setAttribute("data-slick-index", String(index));
      this.originalStyling.set(slide, slide.getAttribute("style") || "");
    });

    this.slider.classList.add("slick-slider");

    const track = this.doc.createElement("div");

    track.className = "slick-track";

    if (this.slideCount === 0) {
      this.slider.append(track);
    } else {
      const first = slides[0];

      first?.before(track);
      track.append(...slides);
    }
    this.trackElement = track;

    const list = this.doc.createElement("div");

    list.className = "slick-list";
    track.before(list);
    list.append(track);
    this.listElement = list;

    setStyle(track, "opacity", 0);

    if (this.options.centerMode === true) {
      this.options.slidesToScroll = 1;
    }

    find(this.slider, "img[data-lazy]")
      .filter((image) => !image.hasAttribute("src"))
      .forEach((image) => image.classList.add("slick-loading"));

    this.setupInfinite();
    this.buildArrows();
    this.buildDots();
    this.updateDots();
    this.setSlideClasses(this.currentSlide);

    if (this.options.draggable === true) {
      list.classList.add("draggable");
    }
  }

  private buildRows(): void {
    if (!(this.options.rows > 0)) {
      return;
    }

    const originalSlides = Array.from(this.slider.children);
    const fragment = this.doc.createDocumentFragment();
    const perSection = this.options.rows;
    const sections = Math.ceil(originalSlides.length / perSection);

    for (let a = 0; a < sections; a++) {
      const slide = this.doc.createElement("div");

      for (let b = 0; b < this.options.rows; b++) {
        const row = this.doc.createElement("div");
        const target = originalSlides[a * perSection + b];

        if (target) {
          row.appendChild(target);
        }
        slide.appendChild(row);
      }
      fragment.appendChild(slide);
    }

    this.slider.replaceChildren(fragment);
    children(this.slider, undefined)
      .flatMap((slide) => children(slide, undefined))
      .flatMap((row) => children(row, undefined))
      .forEach((item) => {
        setStyles(item, { width: `${100 / 1}%`, display: "inline-block" });
      });
  }

  private checkResponsive(initial: boolean, forceUpdate: boolean): void {
    const windowWidth = this.win.innerWidth || viewportSize(this.win, "width");
    let triggerBreakpoint: number | undefined | false = false;

    if (!this.options.responsive.length) {
      return;
    }

    let targetBreakpoint: number | undefined = undefined;

    this.breakpoints.forEach((breakpoint) => {
      if (windowWidth < breakpoint) {
        targetBreakpoint = breakpoint;
      }
    });

    const apply = (breakpoint: number) => {
      this.activeBreakpoint = breakpoint;
      this.options = mergeBreakpoint(
        this.originalSettings,
        this.breakpointSettings.get(breakpoint) ?? {}
      );
      if (initial === true) {
        this.currentSlide = 0;
      }
      this.refresh(initial);
      triggerBreakpoint = breakpoint;
    };

    if (targetBreakpoint !== undefined) {
      if (this.activeBreakpoint !== undefined) {
        if (targetBreakpoint !== this.activeBreakpoint || forceUpdate) {
          apply(targetBreakpoint);
        }
      } else {
        apply(targetBreakpoint);
      }
    } else if (this.activeBreakpoint !== undefined) {
      this.activeBreakpoint = undefined;
      this.options = this.originalSettings;
      if (initial === true) {
        this.currentSlide = 0;
      }
      this.refresh(initial);
      triggerBreakpoint = targetBreakpoint;
    }

    if (!initial && triggerBreakpoint !== false) {
      this.trigger("breakpoint", this.currentSlide);
    }
  }

  private changeSlide(
    data: Message,
    event: Event | undefined,
    dontAnimate: boolean
  ): void {
    const current = event?.currentTarget;
    let target: Element | undefined =
      current instanceof Element ? current : undefined;

    if (target?.matches("a")) {
      event?.preventDefault();
    }

    if (target && !target.matches("li")) {
      target = target.closest("li") ?? undefined;
    }

    const scroll = this.options.slidesToScroll;
    const unevenOffset = this.slideCount % scroll !== 0;
    const indexOffset = unevenOffset ? 0 : (this.slideCount - this.currentSlide) % scroll;

    switch (data.message) {
      case "previous": {
        const slideOffset =
          indexOffset === 0 ? scroll : Number(this.options.slidesToShow) - indexOffset;

        if (greaterThan(this.slideCount, this.options.slidesToShow)) {
          this.slideHandler(this.currentSlide - slideOffset, false, dontAnimate);
        }
        break;
      }
      case "next": {
        const slideOffset = indexOffset === 0 ? scroll : indexOffset;

        if (greaterThan(this.slideCount, this.options.slidesToShow)) {
          this.slideHandler(this.currentSlide + slideOffset, false, dontAnimate);
        }
        break;
      }
      case "index": {
        const index =
          data.index === 0 ? 0 : data.index || siblingIndex(target) * scroll;

        this.slideHandler(this.checkNavigable(index), false, dontAnimate);

        if (target) {
          Array.from(target.children).forEach((child) => {
            if (child instanceof HTMLElement && child !== this.doc.activeElement) {
              child.focus();
            }
          });
        }
        break;
      }
    }
  }

  private checkNavigable(target: number): number {
    const navigables = this.getNavigableIndexes();
    let index = target;
    let prevNavigable = 0;
    const last = navigables[navigables.length - 1];

    if (last !== undefined && index > last) {
      index = last;
    } else {
      for (const navigable of navigables) {
        if (index < navigable) {
          index = prevNavigable;
          break;
        }
        prevNavigable = navigable;
      }
    }

    return index;
  }

  private cleanUpEvents(): void {
    if (this.options.dots && this.dots !== undefined) {
      this.dotEvents.abort();
    }

    this.focusEvents.abort();

    if (this.options.arrows === true && greaterThan(this.slideCount, this.options.slidesToShow)) {
      this.arrowEvents.abort();
    }

    this.listEvents.abort();
    this.documentEvents.abort();
    this.slideEvents.abort();

    if (this.options.focusOnSelect === true) {
      this.selectEvents.abort();
    }

    this.windowEvents.abort();
    this.dragEvents.abort();
  }

  private cleanUpRows(): void {
    if (this.options.rows > 0) {
      const originalSlides = this.ownSlides
        .flatMap((slide) => children(slide, undefined))
        .flatMap((row) => children(row, undefined));

      originalSlides.forEach((slide) => slide.removeAttribute("style"));
      Array.from(this.slider.children).forEach((child) => child.remove());
      this.slider.append(...originalSlides);
    }
  }

  private clickHandler = (event: Event): void => {
    if (this.shouldClick === false) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  private destroy(): void {
    this.autoPlayClear();
    this.touch = {};
    this.cleanUpEvents();

    find(this.slider, ".slick-cloned").forEach((clone) => clone.remove());

    this.dots?.remove();

    const resetArrow = (arrow: Node[] | undefined, option: SliderOptions["prevArrow"]) => {
      if (arrow?.length) {
        removeClass(arrow, "slick-disabled slick-arrow slick-hidden");
        removeAttributes(arrow, "aria-hidden aria-disabled tabindex");
        elementsOf(arrow).forEach((element) => {
          if (element instanceof HTMLElement) {
            setStyle(element, "display", "");
          }
        });

        if (isMarkup(option)) {
          arrow.forEach((node) => node.parentNode?.removeChild(node));
        }
      }
    };

    resetArrow(this.prevArrow, this.options.prevArrow);
    resetArrow(this.nextArrow, this.options.nextArrow);

    if (this.slides) {
      removeClass(this.slides, "slick-slide slick-active slick-center slick-visible slick-current");
      removeAttributes(this.slides, "aria-hidden");
      removeAttributes(this.slides, "data-slick-index");
      this.slides.forEach((slide) => {
        slide.setAttribute("style", this.originalStyling.get(slide) ?? "");
      });

      children(this.track, undefined).forEach((slide) => slide.remove());
      this.track.remove();
      this.list.remove();
      this.slider.append(...this.slides);
    }

    this.cleanUpRows();

    this.slider.classList.remove("slick-slider", "slick-initialized", "slick-dotted");

    this.unslicked = true;
  }

  private disableTransition(slide: number | undefined): void {
    if (this.options.fade === false) {
      setStyle(this.track, this.transitionType, "");
    } else {
      const target = slide === undefined ? undefined : eq(this.ownSlides, slide);

      if (target) {
        setStyle(target, this.transitionType, "");
      }
    }
  }

  private fadeSlide(slideIndex: number, callback: () => void): void {
    const slide = eq(this.ownSlides, slideIndex);

    if (this.cssTransitions === false) {
      if (slide) {
        setStyles(slide, { zIndex: Z_INDEX });
        animate(slide, { opacity: 1 }, this.options.speed, callback);
      }
      return;
    }

    this.applyTransition(slideIndex);

    if (slide) {
      setStyles(slide, { opacity: 1, zIndex: Z_INDEX });
    }

    this.win.setTimeout(() => {
      this.disableTransition(slideIndex);
      callback();
    }, this.options.speed);
  }

  private fadeSlideOut(slideIndex: number): void {
    const slide = eq(this.ownSlides, slideIndex);

    if (this.cssTransitions === false) {
      if (slide) {
        animate(slide, { opacity: 0, zIndex: Z_INDEX - 2 }, this.options.speed, undefined);
      }
      return;
    }

    this.applyTransition(slideIndex);

    if (slide) {
      setStyles(slide, { opacity: 0, zIndex: Z_INDEX - 2 });
    }
  }

  private focusHandler(): void {
    this.focusEvents.abort();
    this.focusEvents = new AbortController();

    const { signal } = this.focusEvents;

    // The elements between the one that got focus and the slider.
    const path = (event: Event): HTMLElement[] => {
      const elements: HTMLElement[] = [];
      let node = event.target instanceof HTMLElement ? event.target : undefined;

      while (node && node !== this.slider && this.slider.contains(node)) {
        elements.push(node);
        node = node.parentElement ?? undefined;
      }

      return elements;
    };

    this.slider.addEventListener(
      "focusin",
      (event) => {
        path(event).forEach((element) => {
          this.win.setTimeout(() => {
            if (this.options.pauseOnFocus) {
              if (element.matches(":focus")) {
                this.focussed = true;
                this.autoPlay();
              }
            }
          }, 0);
        });
      },
      { signal }
    );

    this.slider.addEventListener(
      "focusout",
      (event) => {
        path(event).forEach(() => {
          if (this.options.pauseOnFocus) {
            this.focussed = false;
            this.autoPlay();
          }
        });
      },
      { signal }
    );
  }

  private getDotCount(): number {
    let breakPoint = 0;
    let counter = 0;
    let pagerQty = 0;
    const show = this.options.slidesToShow;
    const scroll = this.options.slidesToScroll;

    if (this.options.infinite === true) {
      if (atMost(this.slideCount, show)) {
        ++pagerQty;
      } else {
        while (breakPoint < this.slideCount) {
          ++pagerQty;
          breakPoint = counter + scroll;
          counter += atMost(scroll, show) ? scroll : Number(show);
        }
      }
    } else if (this.options.centerMode === true) {
      pagerQty = this.slideCount;
    } else {
      pagerQty = 1 + Math.ceil((this.slideCount - Number(show)) / scroll);
    }

    return pagerQty - 1;
  }

  private firstSlideOuterHeight(): number {
    const first = this.ownSlides[0];

    return first ? measure(first, "height", "margin") : Number.NaN;
  }

  private getLeft(slideIndex: number): number {
    const show = this.options.slidesToShow;
    const scroll = this.options.slidesToScroll;
    let targetLeft: number;
    let verticalOffset = 0;

    this.slideOffset = 0;
    const verticalHeight = this.firstSlideOuterHeight();

    if (this.options.infinite === true) {
      if (greaterThan(this.slideCount, show)) {
        this.slideOffset = this.slideWidth * Number(show) * -1;
        let coef = -1;

        if (this.options.vertical === true && this.options.centerMode === true) {
          if (show === 2) {
            coef = -1.5;
          } else if (show === 1) {
            coef = -2;
          }
        }
        verticalOffset = verticalHeight * Number(show) * coef;
      }
      if (this.slideCount % scroll !== 0) {
        if (
          greaterThan(slideIndex + scroll, this.slideCount) &&
          greaterThan(this.slideCount, show)
        ) {
          if (slideIndex > this.slideCount) {
            this.slideOffset =
              (Number(show) - (slideIndex - this.slideCount)) * this.slideWidth * -1;
            verticalOffset =
              (Number(show) - (slideIndex - this.slideCount)) * verticalHeight * -1;
          } else {
            this.slideOffset = (this.slideCount % scroll) * this.slideWidth * -1;
            verticalOffset = (this.slideCount % scroll) * verticalHeight * -1;
          }
        }
      }
    } else if (greaterThan(add(slideIndex, show), this.slideCount)) {
      this.slideOffset = (Number(add(slideIndex, show)) - this.slideCount) * this.slideWidth;
      verticalOffset = (Number(add(slideIndex, show)) - this.slideCount) * verticalHeight;
    }

    if (atMost(this.slideCount, show)) {
      this.slideOffset = 0;
      verticalOffset = 0;
    }

    if (this.options.centerMode === true && atMost(this.slideCount, show)) {
      this.slideOffset =
        (this.slideWidth * Math.floor(Number(show))) / 2 -
        (this.slideWidth * this.slideCount) / 2;
    } else if (this.options.centerMode === true && this.options.infinite === true) {
      this.slideOffset += this.slideWidth * Math.floor(Number(show) / 2) - this.slideWidth;
    } else if (this.options.centerMode === true) {
      this.slideOffset = 0;
      this.slideOffset += this.slideWidth * Math.floor(Number(show) / 2);
    }

    if (this.options.vertical === false) {
      targetLeft = slideIndex * this.slideWidth * -1 + this.slideOffset;
    } else {
      targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
    }

    if (this.options.variableWidth === true) {
      const trackSlides = children(this.track, ".slick-slide");
      const pick = (offset: Count) =>
        atMost(this.slideCount, show) || this.options.infinite === false
          ? eq(trackSlides, slideIndex)
          : eq(trackSlides, add(slideIndex, offset));
      const leftOf = (slide: HTMLElement | undefined) => {
        if (this.options.rtl === true) {
          return slide
            ? (measure(this.track, "width", "content") -
                slide.offsetLeft -
                measure(slide, "width", "content")) *
                -1
            : 0;
        }
        return slide ? slide.offsetLeft * -1 : 0;
      };

      targetLeft = leftOf(pick(show));

      if (this.options.centerMode === true) {
        const targetSlide = pick(add(show, 1));

        targetLeft = leftOf(targetSlide);
        targetLeft +=
          (measure(this.list, "width", "content") -
            (targetSlide ? measure(targetSlide, "width", "border") : Number.NaN)) /
          2;
      }
    }

    return targetLeft;
  }

  private getNavigableIndexes(): number[] {
    let breakPoint = 0;
    let counter = 0;
    const indexes: number[] = [];
    let max: number;
    const show = this.options.slidesToShow;
    const scroll = this.options.slidesToScroll;

    if (this.options.infinite === false) {
      max = this.slideCount;
    } else {
      breakPoint = scroll * -1;
      counter = scroll * -1;
      max = this.slideCount * 2;
    }

    while (breakPoint < max) {
      indexes.push(breakPoint);
      breakPoint = counter + scroll;
      counter += atMost(scroll, show) ? scroll : Number(show);
    }

    return indexes;
  }

  private init(creation: boolean): void {
    if (!this.slider.classList.contains("slick-initialized")) {
      this.slider.classList.add("slick-initialized");

      this.buildRows();
      this.buildOut();
      this.setProps();
      this.startLoad();
      this.loadSlider();
      this.initializeEvents();
      this.updateArrows();
      this.updateDots();
      this.checkResponsive(true, false);
      this.focusHandler();
    }

    if (creation) {
      this.trigger("init", this.currentSlide);
    }

    if (this.options.accessibility === true) {
      this.initADA();
    }

    if (this.options.autoplay) {
      this.paused = false;
      this.autoPlay();
    }
  }

  private initADA(): void {
    const show = this.options.slidesToShow;
    const numDotGroups = Math.ceil(this.slideCount / Number(show));
    const tabControlIndexes = this.getNavigableIndexes().filter(
      (value) => value >= 0 && value < this.slideCount
    );
    const clones = find(this.track, ".slick-cloned");
    const all = [...new Set([...this.ownSlides, ...clones])].sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );

    setAttributes(all, { "aria-hidden": "true", tabindex: "-1" });
    setAttributes(
      all.flatMap((slide) => find(slide, "a, input, button, select")),
      { tabindex: "-1" }
    );

    if (this.dots !== undefined) {
      this.ownSlides
        .filter((slide) => !clones.includes(slide))
        .forEach((slide, i) => {
          const slideControlIndex = tabControlIndexes.indexOf(i);

          setAttributes([slide], {
            role: "tabpanel",
            id: `slick-slide${this.instanceUid}${i}`,
            tabindex: -1
          });

          if (slideControlIndex !== -1) {
            const ariaButtonControl = `slick-slide-control${this.instanceUid}${slideControlIndex}`;

            if (this.doc.getElementById(ariaButtonControl)) {
              setAttributes([slide], { "aria-describedby": ariaButtonControl });
            }
          }
        });

      this.dots.setAttribute("role", "tablist");

      const items = find(this.dots, "li");

      items.forEach((item, i) => {
        const mappedSlideIndex = tabControlIndexes[i];

        item.setAttribute("role", "presentation");

        const button = find(item, "button")[0];

        if (button) {
          setAttributes([button], {
            role: "tab",
            id: `slick-slide-control${this.instanceUid}${i}`,
            "aria-controls": `slick-slide${this.instanceUid}${mappedSlideIndex}`,
            "aria-label": `${i + 1} of ${numDotGroups}`,
            "aria-selected": null,
            tabindex: "-1"
          });
        }
      });

      const currentItem = eq(items, this.currentSlide);

      if (currentItem) {
        setAttributes(find(currentItem, "button"), {
          "aria-selected": "true",
          tabindex: "0"
        });
      }
    }

    for (
      let i = this.currentSlide, max = add(i, show);
      lessThan(i, max);
      i++
    ) {
      const slide = eq(this.ownSlides, i);

      slide?.removeAttribute("tabindex");
    }

    this.activateADA();
  }

  private initArrowEvents(): void {
    if (!(this.options.arrows === true && greaterThan(this.slideCount, this.options.slidesToShow))) {
      return;
    }

    this.arrowEvents = new AbortController();

    const { signal } = this.arrowEvents;

    elementsOf(this.prevArrow ?? []).forEach((arrow) => {
      arrow.addEventListener(
        "click",
        (event) => this.changeSlide({ message: "previous" }, event, false),
        { signal }
      );
    });
    elementsOf(this.nextArrow ?? []).forEach((arrow) => {
      arrow.addEventListener(
        "click",
        (event) => this.changeSlide({ message: "next" }, event, false),
        { signal }
      );
    });

    if (this.options.accessibility === true) {
      elementsOf([...(this.prevArrow ?? []), ...(this.nextArrow ?? [])]).forEach((arrow) => {
        arrow.addEventListener("keydown", this.keyHandler, { signal });
      });
    }
  }

  private initDotEvents(): void {
    if (!(this.options.dots === true && greaterThan(this.slideCount, this.options.slidesToShow))) {
      return;
    }

    this.dotEvents = new AbortController();

    const { signal } = this.dotEvents;
    const dots = this.dots;

    if (!dots) {
      return;
    }

    find(dots, "li").forEach((item) => {
      item.addEventListener(
        "click",
        (event) => this.changeSlide({ message: "index", index: undefined }, event, false),
        { signal }
      );
    });

    if (this.options.accessibility === true) {
      dots.addEventListener("keydown", this.keyHandler, { signal });
    }
  }

  private initSlideEvents(): void {
    if (!this.options.pauseOnHover) {
      return;
    }

    this.slideEvents = new AbortController();

    const { signal } = this.slideEvents;

    this.list.addEventListener("mouseenter", () => this.interrupt(true), { signal });
    this.list.addEventListener("mouseleave", () => this.interrupt(false), { signal });
  }

  private initializeEvents(): void {
    this.initArrowEvents();
    this.initDotEvents();
    this.initSlideEvents();

    this.listEvents = new AbortController();

    const list = this.list;
    const listOptions = { signal: this.listEvents.signal };
    const on = (types: string[], action: SwipeAction) => {
      types.forEach((type) => {
        list.addEventListener(type, (event) => this.swipeHandler(event, action), listOptions);
      });
    };

    on(["touchstart", "mousedown"], "start");
    on(["touchmove", "mousemove"], "move");
    on(["touchend", "mouseup"], "end");
    on(["touchcancel", "mouseleave"], "end");

    list.addEventListener("click", this.clickHandler, listOptions);

    this.documentEvents = new AbortController();
    this.doc.addEventListener(this.visibilityChange, this.visibility, {
      signal: this.documentEvents.signal
    });

    if (this.options.accessibility === true) {
      list.addEventListener("keydown", this.keyHandler, listOptions);
    }

    if (this.options.focusOnSelect === true) {
      this.selectEvents = new AbortController();

      const selectOptions = { signal: this.selectEvents.signal };

      children(this.track, undefined).forEach((slide) => {
        slide.addEventListener("click", this.selectHandler, selectOptions);
      });
    }

    this.windowEvents = new AbortController();

    const windowOptions = { signal: this.windowEvents.signal };

    this.win.addEventListener("orientationchange", this.orientationChange, windowOptions);
    this.win.addEventListener("resize", this.resize, windowOptions);

    this.dragEvents = new AbortController();

    const dragOptions = { signal: this.dragEvents.signal };

    find(this.track, "*")
      .filter((element) => element.getAttribute("draggable") !== "true")
      .forEach((element) => {
        element.addEventListener("dragstart", this.preventDefault, dragOptions);
      });

    this.win.addEventListener("load", this.setPosition, windowOptions);
    this.whenReady(this.setPosition);
  }

  /** After the document is ready, in a task of its own. */
  private whenReady(callback: () => void): void {
    const run = () => this.win.setTimeout(callback);

    if (this.doc.readyState !== "loading") {
      run();
    } else {
      this.doc.addEventListener("DOMContentLoaded", run, { once: true });
    }
  }

  private initUI(): void {
    if (this.options.arrows === true && greaterThan(this.slideCount, this.options.slidesToShow)) {
      show(this.prevArrow ?? []);
      show(this.nextArrow ?? []);
    }

    if (this.options.dots === true && greaterThan(this.slideCount, this.options.slidesToShow)) {
      show(this.dots ? [this.dots] : []);
    }
  }

  private keyHandler = (event: Event): void => {
    const target = event.target;
    const keyCode = event instanceof KeyboardEvent ? event.keyCode : undefined;

    if (!(target instanceof Element) || target.tagName.match("TEXTAREA|INPUT|SELECT")) {
      return;
    }

    if (keyCode === 37 && this.options.accessibility === true) {
      this.changeSlide(
        { message: this.options.rtl === true ? "next" : "previous" },
        undefined,
        false
      );
    } else if (keyCode === 39 && this.options.accessibility === true) {
      this.changeSlide(
        { message: this.options.rtl === true ? "previous" : "next" },
        undefined,
        false
      );
    }
  };

  private lazyLoad(): void {
    const show = this.options.slidesToShow;
    let rangeStart: Count;
    let rangeEnd: Count;

    const loadImages = (scope: HTMLElement[]) => {
      [...new Set(scope.flatMap((element) => find(element, "img[data-lazy]")))]
        .forEach((image) => {
          const imageSource = image.getAttribute("data-lazy") ?? undefined;
          const imageSrcSet = image.getAttribute("data-srcset") ?? undefined;
          const imageSizes =
            image.getAttribute("data-sizes") ||
            this.slider.getAttribute("data-sizes") ||
            undefined;
          const imageToLoad = this.doc.createElement("img");

          imageToLoad.onload = () => {
            animate(image, { opacity: 0 }, 100, () => {
              if (imageSrcSet) {
                image.setAttribute("srcset", imageSrcSet);

                if (imageSizes) {
                  image.setAttribute("sizes", imageSizes);
                }
              }

              if (imageSource !== undefined) {
                image.setAttribute("src", imageSource);
              }
              animate(image, { opacity: 1 }, 200, () => {
                removeAttributes([image], "data-lazy data-srcset data-sizes");
                image.classList.remove("slick-loading");
              });
            });
          };

          imageToLoad.onerror = () => {
            image.removeAttribute("data-lazy");
            image.classList.remove("slick-loading");
            image.classList.add("slick-lazyload-error");
          };

          imageToLoad.src = imageSource ?? "undefined";
        });
    };

    if (this.options.centerMode === true) {
      if (this.options.infinite === true) {
        rangeStart = this.currentSlide + (Number(show) / 2 + 1);
        rangeEnd = add(add(rangeStart, show), 2);
      } else {
        rangeStart = Math.max(0, this.currentSlide - (Number(show) / 2 + 1));
        rangeEnd = 2 + (Number(show) / 2 + 1) + this.currentSlide;
      }
    } else {
      rangeStart = this.options.infinite ? add(show, this.currentSlide) : this.currentSlide;
      rangeEnd = Math.ceil(Number(add(rangeStart, show)));
      if (this.options.fade === true) {
        if (greaterThan(rangeStart, 0)) rangeStart = Number(rangeStart) - 1;
        if (atMost(rangeEnd, this.slideCount)) rangeEnd = Number(rangeEnd) + 1;
      }
    }

    const allSlides = find(this.slider, ".slick-slide");

    loadImages(slice(allSlides, rangeStart, rangeEnd));

    if (atMost(this.slideCount, show)) {
      loadImages(find(this.slider, ".slick-slide"));
    } else if (atLeast(this.currentSlide, this.slideCount - Number(show))) {
      loadImages(slice(find(this.slider, ".slick-cloned"), 0, show));
    } else if (this.currentSlide === 0) {
      loadImages(slice(find(this.slider, ".slick-cloned"), Number(show) * -1));
    }
  }

  private loadSlider(): void {
    this.setPosition();

    setStyles(this.track, { opacity: 1 });

    this.slider.classList.remove("slick-loading");

    this.initUI();
  }

  private orientationChange = (): void => {
    this.checkResponsive(false, false);
    this.setPosition();
  };

  private postSlide(index: number): void {
    if (this.unslicked) {
      return;
    }

    this.trigger("afterChange", index);

    this.animating = false;

    if (greaterThan(this.slideCount, this.options.slidesToShow)) {
      this.setPosition();
    }

    this.swipeLeft = undefined;

    if (this.options.autoplay) {
      this.autoPlay();
    }

    if (this.options.accessibility === true) {
      this.initADA();
    }
  }

  private preventDefault = (event: Event): void => {
    event.preventDefault();
  };

  private refresh(initializing: boolean): void {
    const lastVisibleIndex = this.slideCount - Number(this.options.slidesToShow);

    if (!this.options.infinite && this.currentSlide > lastVisibleIndex) {
      this.currentSlide = lastVisibleIndex;
    }

    if (atMost(this.slideCount, this.options.slidesToShow)) {
      this.currentSlide = 0;
    }

    const currentSlide = this.currentSlide;

    this.destroy();
    this.resetInitials(currentSlide);
    this.init(false);

    if (!initializing) {
      this.changeSlide({ message: "index", index: currentSlide }, undefined, false);
    }
  }

  private registerBreakpoints(): void {
    const responsiveSettings = this.options.responsive;

    if (!responsiveSettings.length) {
      return;
    }

    responsiveSettings.forEach(({ breakpoint, settings }) => {
      for (let l = this.breakpoints.length - 1; l >= 0; l--) {
        if (this.breakpoints[l] && this.breakpoints[l] === breakpoint) {
          this.breakpoints.splice(l, 1);
        }
      }

      this.breakpoints.push(breakpoint);
      this.breakpointSettings.set(breakpoint, settings);
    });

    this.breakpoints.sort((a, b) => b - a);
  }

  private resize = (): void => {
    if (viewportSize(this.win, "width") !== this.windowWidth) {
      this.win.clearTimeout(this.windowDelay);
      this.windowDelay = this.win.setTimeout(() => {
        this.windowWidth = viewportSize(this.win, "width");
        this.checkResponsive(false, false);
        if (!this.unslicked) {
          this.setPosition();
        }
      }, 50);
    }
  };

  private setCSS(target: number): void {
    const position = this.options.rtl === true ? -target : target;
    const x = this.positionProp === "left" ? `${Math.ceil(position)}px` : "0px";
    const y = this.positionProp === "top" ? `${Math.ceil(position)}px` : "0px";

    if (this.transformsEnabled === false) {
      setStyle(this.track, this.positionProp, position);
    } else if (typeof this.animType === "string") {
      setStyle(
        this.track,
        this.animType,
        this.cssTransitions === false
          ? `translate(${x}, ${y})`
          : `translate3d(${x}, ${y}, 0px)`
      );
    }
  }

  private setDimensions(): void {
    const show = this.options.slidesToShow;
    const first = this.ownSlides[0];
    const trackSlides = () => children(this.track, ".slick-slide");

    if (this.options.vertical === false) {
      if (this.options.centerMode === true) {
        setStyles(this.list, { padding: `0px ${this.options.centerPadding}` });
      }
    } else {
      setSize(this.list, "height", this.firstSlideOuterHeight() * Number(show), "content");
      if (this.options.centerMode === true) {
        setStyles(this.list, { padding: `${this.options.centerPadding} 0px` });
      }
    }

    this.listWidth = measure(this.list, "width", "content");

    if (this.options.vertical === false && this.options.variableWidth === false) {
      this.slideWidth = Math.ceil(this.listWidth / Number(show));
      setSize(
        this.track,
        "width",
        Math.ceil(this.slideWidth * trackSlides().length),
        "content"
      );
    } else if (this.options.variableWidth === true) {
      setSize(this.track, "width", 5000 * this.slideCount, "content");
    } else {
      this.slideWidth = Math.ceil(this.listWidth);
      setSize(
        this.track,
        "height",
        Math.ceil(this.firstSlideOuterHeight() * trackSlides().length),
        "content"
      );
    }

    const offset = first
      ? measure(first, "width", "margin") - measure(first, "width", "content")
      : Number.NaN;

    if (this.options.variableWidth === false) {
      trackSlides().forEach((slide) => {
        setSize(slide, "width", this.slideWidth - offset, "content");
      });
    }
  }

  private setFade(): void {
    this.ownSlides.forEach((slide, index) => {
      const targetLeft = this.slideWidth * index * -1;

      setStyles(slide, {
        position: "relative",
        [this.options.rtl === true ? "right" : "left"]: targetLeft,
        top: 0,
        zIndex: Z_INDEX - 2,
        opacity: 0
      });
    });

    const current = eq(this.ownSlides, this.currentSlide);

    if (current) {
      setStyles(current, { zIndex: Z_INDEX - 1, opacity: 1 });
    }
  }

  private setProps(): void {
    const bodyStyle = this.doc.body.style;
    const has = (property: string) => Reflect.get(bodyStyle, property) !== undefined;

    this.positionProp = this.options.vertical === true ? "top" : "left";

    if (this.positionProp === "top") {
      this.slider.classList.add("slick-vertical");
    } else {
      this.slider.classList.remove("slick-vertical");
    }

    if (has("WebkitTransition") || has("MozTransition") || has("msTransition")) {
      this.cssTransitions = true;
    }

    if (has("OTransform")) {
      this.animType = "OTransform";
      this.transformType = "-o-transform";
      this.transitionType = "OTransition";
      if (!has("perspectiveProperty") && !has("webkitPerspective")) this.animType = false;
    }
    if (has("MozTransform")) {
      this.animType = "MozTransform";
      this.transformType = "-moz-transform";
      this.transitionType = "MozTransition";
      if (!has("perspectiveProperty") && !has("MozPerspective")) this.animType = false;
    }
    if (has("webkitTransform")) {
      this.animType = "webkitTransform";
      this.transformType = "-webkit-transform";
      this.transitionType = "webkitTransition";
      if (!has("perspectiveProperty") && !has("webkitPerspective")) this.animType = false;
    }
    if (has("msTransform")) {
      this.animType = "msTransform";
      this.transformType = "-ms-transform";
      this.transitionType = "msTransition";
    }
    if (has("transform") && this.animType !== false) {
      this.animType = "transform";
      this.transformType = "transform";
      this.transitionType = "transition";
    }
    this.transformsEnabled =
      this.options.useTransform && this.animType !== undefined && this.animType !== false;
  }

  private setSlideClasses(index: number): void {
    const show = this.options.slidesToShow;
    const slides = this.ownSlides;
    const allSlides = find(this.slider, ".slick-slide");
    const activate = (elements: HTMLElement[]) => {
      addClass(elements, "slick-active");
      setAttributes(elements, { "aria-hidden": "false" });
    };

    removeClass(allSlides, "slick-active slick-center slick-current");
    setAttributes(allSlides, { "aria-hidden": "true" });

    eq(slides, index)?.classList.add("slick-current");

    if (this.options.centerMode === true) {
      const evenCoef = Number(show) % 2 === 0 ? 1 : 0;
      const centerOffset = Math.floor(Number(show) / 2);

      if (this.options.infinite === true) {
        if (index >= centerOffset && index <= this.slideCount - 1 - centerOffset) {
          activate(slice(slides, index - centerOffset + evenCoef, index + centerOffset + 1));
        } else {
          const indexOffset = add(show, index);

          activate(
            slice(
              allSlides,
              Number(indexOffset) - centerOffset + 1 + evenCoef,
              add(add(indexOffset, centerOffset), 2)
            )
          );
        }

        if (index === 0) {
          eq(allSlides, add(add(show, this.slideCount), 1))?.classList.add("slick-center");
        } else if (index === this.slideCount - 1) {
          eq(allSlides, show)?.classList.add("slick-center");
        }
      }

      eq(slides, index)?.classList.add("slick-center");
    } else if (index >= 0 && atMost(index, this.slideCount - Number(show))) {
      activate(slice(slides, index, add(index, show)));
    } else if (atMost(allSlides.length, show)) {
      activate(allSlides);
    } else {
      const remainder = this.slideCount % Number(show);
      const indexOffset = this.options.infinite === true ? add(show, index) : index;

      if (
        looselyEqual(show, this.options.slidesToScroll) &&
        lessThan(this.slideCount - index, show)
      ) {
        activate(
          slice(
            allSlides,
            Number(indexOffset) - (Number(show) - remainder),
            add(indexOffset, remainder)
          )
        );
      } else {
        activate(slice(allSlides, indexOffset, add(indexOffset, show)));
      }
    }

    if (this.options.lazyLoad === "ondemand") {
      this.lazyLoad();
    }
  }

  private setupInfinite(): void {
    const show = this.options.slidesToShow;

    if (this.options.fade === true) {
      this.options.centerMode = false;
    }

    if (!(this.options.infinite === true && this.options.fade === false)) {
      return;
    }

    if (!greaterThan(this.slideCount, show)) {
      return;
    }

    const infiniteCount: Count = this.options.centerMode === true ? add(show, 1) : show;
    const slides = this.ownSlides;
    const clone = (slide: HTMLElement | undefined, index: number): HTMLElement[] => {
      if (!slide) {
        return [];
      }

      const copy = slide.cloneNode(true);

      if (!(copy instanceof HTMLElement)) {
        return [];
      }

      copy.setAttribute("id", "");
      copy.setAttribute("data-slick-index", String(index));

      return [copy];
    };

    for (let i = this.slideCount; greaterThan(i, this.slideCount - Number(infiniteCount)); i -= 1) {
      const slideIndex = i - 1;

      clone(slides[slideIndex], slideIndex - this.slideCount).forEach((copy) => {
        this.track.prepend(copy);
        copy.classList.add("slick-cloned");
      });
    }
    for (let i = 0; lessThan(i, add(infiniteCount, this.slideCount)); i += 1) {
      const slideIndex = i;

      clone(slides[slideIndex], slideIndex + this.slideCount).forEach((copy) => {
        this.track.append(copy);
        copy.classList.add("slick-cloned");
      });
    }

    find(this.track, ".slick-cloned")
      .flatMap((copy) => find(copy, "[id]"))
      .forEach((element) => element.setAttribute("id", ""));
  }

  private interrupt(toggle: boolean): void {
    if (!toggle) {
      this.autoPlay();
    }
    this.interrupted = toggle;
  }

  private selectHandler = (event: Event): void => {
    const target = event.target instanceof Element ? event.target : undefined;
    const slide = target?.matches(".slick-slide")
      ? target
      : target?.parentElement?.closest(".slick-slide");
    let index = Number.parseInt(slide?.getAttribute("data-slick-index") ?? "");

    if (!index) index = 0;

    if (atMost(this.slideCount, this.options.slidesToShow)) {
      this.slideHandler(index, false, true);
      return;
    }

    this.slideHandler(index, false, false);
  };

  private slideHandler(index: number, _sync: boolean, dontAnimate: boolean): void {
    const show = this.options.slidesToShow;
    const scroll = this.options.slidesToScroll;
    let targetSlide: number;
    let animSlide: number;

    if (this.animating === true) {
      return;
    }

    if (this.options.fade === true && this.currentSlide === index) {
      return;
    }

    targetSlide = index;
    const targetLeft = this.getLeft(targetSlide);
    const slideLeft = this.getLeft(this.currentSlide);

    this.currentLeft = this.swipeLeft === undefined ? slideLeft : this.swipeLeft;

    const settle = () => {
      if (this.options.fade === false) {
        targetSlide = this.currentSlide;
        if (dontAnimate !== true && greaterThan(this.slideCount, show)) {
          this.animateSlide(slideLeft, () => {
            this.postSlide(targetSlide);
          });
        } else {
          this.postSlide(targetSlide);
        }
      }
    };

    if (
      this.options.infinite === false &&
      this.options.centerMode === false &&
      (index < 0 || index > this.getDotCount() * scroll)
    ) {
      settle();
      return;
    } else if (
      this.options.infinite === false &&
      this.options.centerMode === true &&
      (index < 0 || index > this.slideCount - scroll)
    ) {
      settle();
      return;
    }

    if (this.options.autoplay) {
      this.win.clearInterval(this.autoPlayTimer);
    }

    if (targetSlide < 0) {
      if (this.slideCount % scroll !== 0) {
        animSlide = this.slideCount - (this.slideCount % scroll);
      } else {
        animSlide = this.slideCount + targetSlide;
      }
    } else if (targetSlide >= this.slideCount) {
      if (this.slideCount % scroll !== 0) {
        animSlide = 0;
      } else {
        animSlide = targetSlide - this.slideCount;
      }
    } else {
      animSlide = targetSlide;
    }

    this.animating = true;

    this.trigger("beforeChange", animSlide);

    const oldSlide = this.currentSlide;

    this.currentSlide = animSlide;

    this.setSlideClasses(this.currentSlide);

    this.updateDots();
    this.updateArrows();

    if (this.options.fade === true) {
      if (dontAnimate !== true) {
        this.fadeSlideOut(oldSlide);
        this.fadeSlide(animSlide, () => {
          this.postSlide(animSlide);
        });
      } else {
        this.postSlide(animSlide);
      }
      return;
    }

    if (dontAnimate !== true && greaterThan(this.slideCount, show)) {
      this.animateSlide(targetLeft, () => {
        this.postSlide(animSlide);
      });
    } else {
      this.postSlide(animSlide);
    }
  }

  private startLoad(): void {
    if (this.options.arrows === true && greaterThan(this.slideCount, this.options.slidesToShow)) {
      hide(this.prevArrow ?? []);
      hide(this.nextArrow ?? []);
    }

    if (this.options.dots === true && greaterThan(this.slideCount, this.options.slidesToShow)) {
      hide(this.dots ? [this.dots] : []);
    }

    this.slider.classList.add("slick-loading");
  }

  private swipeDirection(): "left" | "right" | "vertical" {
    const xDist = (this.touch.startX ?? Number.NaN) - (this.touch.curX ?? Number.NaN);
    const yDist = (this.touch.startY ?? Number.NaN) - (this.touch.curY ?? Number.NaN);
    const r = Math.atan2(yDist, xDist);
    let swipeAngle = Math.round((r * 180) / Math.PI);

    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }

    if (swipeAngle <= 45 && swipeAngle >= 0) {
      return this.options.rtl === false ? "left" : "right";
    }
    if (swipeAngle <= 360 && swipeAngle >= 315) {
      return this.options.rtl === false ? "left" : "right";
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return this.options.rtl === false ? "right" : "left";
    }

    return "vertical";
  }

  private swipeEnd(): void {
    this.dragging = false;
    this.swiping = false;

    if (this.scrolling) {
      this.scrolling = false;
      return;
    }

    this.interrupted = false;
    this.shouldClick = !((this.touch.swipeLength ?? Number.NaN) > 10);

    if (this.touch.curX === undefined) {
      return;
    }

    if ((this.touch.swipeLength ?? Number.NaN) >= (this.touch.minSwipe ?? Number.NaN)) {
      const direction = this.swipeDirection();
      let slideCount = Number.NaN;

      switch (direction) {
        case "left":
          slideCount = this.currentSlide + this.options.slidesToScroll;
          break;
        case "right":
          slideCount = this.currentSlide - this.options.slidesToScroll;
          break;
        default:
      }

      if (direction !== "vertical") {
        this.slideHandler(slideCount, false, false);
        this.touch = {};
      }
    } else if (this.touch.startX !== this.touch.curX) {
      this.slideHandler(this.currentSlide, false, false);
      this.touch = {};
    }
  }

  private touchesOf(event: Event) {
    const parsed = touchesSchema.safeParse(Reflect.get(event, "touches"));

    return parsed.success ? parsed.data : undefined;
  }

  private clientOf(event: Event, axis: "x" | "y"): number | undefined {
    if (event instanceof MouseEvent) {
      return axis === "x" ? event.clientX : event.clientY;
    }
    return undefined;
  }

  private swipeHandler(event: Event, action: SwipeAction): void {
    if (this.options.swipe === false) {
      return;
    } else if (this.options.draggable === false && event.type.indexOf("mouse") !== -1) {
      return;
    }

    const touches = this.touchesOf(event);

    this.touch.fingerCount = touches !== undefined ? touches.length : 1;
    this.touch.minSwipe = this.listWidth / this.options.touchThreshold;

    switch (action) {
      case "start":
        this.swipeStart(event, touches);
        break;
      case "move":
        this.swipeMove(event, touches);
        break;
      case "end":
        this.swipeEnd();
        break;
    }
  }

  private swipeMove(event: Event, touches: ReturnType<Slider["touchesOf"]>): void {
    if (!this.dragging || this.scrolling || (touches && touches.length !== 1)) {
      return;
    }

    const curLeft = this.getLeft(this.currentSlide);
    const first = touches?.[0];

    this.touch.curX = touches !== undefined ? first?.pageX : this.clientOf(event, "x");
    this.touch.curY = touches !== undefined ? first?.pageY : this.clientOf(event, "y");

    const curX = this.touch.curX ?? Number.NaN;
    const curY = this.touch.curY ?? Number.NaN;
    const startX = this.touch.startX ?? Number.NaN;
    const startY = this.touch.startY ?? Number.NaN;

    this.touch.swipeLength = Math.round(Math.sqrt((curX - startX) ** 2));

    const verticalSwipeLength = Math.round(Math.sqrt((curY - startY) ** 2));

    if (!this.swiping && verticalSwipeLength > 40) {
      this.scrolling = true;
      return;
    }

    const swipeDirection = this.swipeDirection();

    if (this.touch.swipeLength > 40) {
      this.swiping = true;
      event.preventDefault();
    }

    const positionOffset = (this.options.rtl === false ? 1 : -1) * (curX > startX ? 1 : -1);
    let swipeLength = this.touch.swipeLength;

    this.touch.edgeHit = false;

    if (this.options.infinite === false) {
      if (
        (this.currentSlide === 0 && swipeDirection === "right") ||
        (this.currentSlide >= this.getDotCount() && swipeDirection === "left")
      ) {
        swipeLength = this.touch.swipeLength * EDGE_FRICTION;
        this.touch.edgeHit = true;
      }
    }

    if (this.options.vertical === false) {
      this.swipeLeft = curLeft + swipeLength * positionOffset;
    } else {
      this.swipeLeft =
        curLeft +
        swipeLength * (measure(this.list, "height", "content") / this.listWidth) * positionOffset;
    }

    if (this.options.fade === true) {
      return;
    }

    if (this.animating === true) {
      this.swipeLeft = undefined;
      return;
    }

    this.setCSS(this.swipeLeft);
  }

  private swipeStart(event: Event, touches: ReturnType<Slider["touchesOf"]>): void {
    this.interrupted = true;

    if (this.touch.fingerCount !== 1 || atMost(this.slideCount, this.options.slidesToShow)) {
      this.touch = {};
      return;
    }

    const first = touches?.[0];

    this.touch.startX = this.touch.curX =
      first !== undefined ? first.pageX : this.clientOf(event, "x");
    this.touch.startY = this.touch.curY =
      first !== undefined ? first.pageY : this.clientOf(event, "y");

    this.dragging = true;
  }

  private updateArrows(): void {
    const prev = this.prevArrow ?? [];
    const next = this.nextArrow ?? [];
    const enable = (arrow: Node[]) => {
      removeClass(arrow, "slick-disabled");
      setAttributes(arrow, { "aria-disabled": "false" });
    };
    const disable = (arrow: Node[]) => {
      addClass(arrow, "slick-disabled");
      setAttributes(arrow, { "aria-disabled": "true" });
    };

    if (
      !(
        this.options.arrows === true &&
        greaterThan(this.slideCount, this.options.slidesToShow) &&
        !this.options.infinite
      )
    ) {
      return;
    }

    enable(prev);
    enable(next);

    if (this.currentSlide === 0) {
      disable(prev);
      enable(next);
    } else if (
      atLeast(this.currentSlide, this.slideCount - Number(this.options.slidesToShow)) &&
      this.options.centerMode === false
    ) {
      disable(next);
      enable(prev);
    } else if (this.currentSlide >= this.slideCount - 1 && this.options.centerMode === true) {
      disable(next);
      enable(prev);
    }
  }

  private updateDots(): void {
    if (this.dots === undefined) {
      return;
    }

    const items = find(this.dots, "li");

    removeClass(items, "slick-active");
    eq(items, Math.floor(this.currentSlide / this.options.slidesToScroll))?.classList.add(
      "slick-active"
    );
  }

  private visibility = (): void => {
    if (this.options.autoplay) {
      this.interrupted = !!Reflect.get(this.doc, this.hidden);
    }
  };
}
