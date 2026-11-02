/** Settings a responsive breakpoint may override. */
export interface SliderBreakpointSettings {
  slidesToShow?: number | string;
  slidesToScroll?: number;
  centerPadding?: string;
  speed?: number;
}

export interface SliderBreakpoint {
  /** Max viewport width (px) the settings apply to. */
  breakpoint: number;
  settings: SliderBreakpointSettings;
}

/** Every setting a published-page slider is built with; all are required. */
export interface SliderOptions {
  /** Ministry Brands passes the raw `data-brz-show` string; it is used as given. */
  slidesToShow: number | string;
  slidesToScroll: number;
  infinite: boolean;
  fade: boolean;
  vertical: boolean;
  rtl: boolean;
  /** Transition duration, ms. */
  speed: number;
  autoplay: boolean;
  autoplaySpeed: number;
  pauseOnHover: boolean;
  pauseOnFocus: boolean;
  arrows: boolean;
  /** The previous / next arrow: markup, an element in the page, or `false` for none. */
  prevArrow: string | HTMLElement | false;
  nextArrow: string | HTMLElement | false;
  dots: boolean;
  dotsClass: string;
  /** Markup of the dot for a slide index; `undefined` keeps the numbered button. */
  customPaging: ((index: number) => string) | undefined;
  responsive: SliderBreakpoint[];
  swipe: boolean;
  draggable: boolean;
  touchThreshold: number;
  /** `false` moves the track through its `left` / `top` instead of a transform. */
  useTransform: boolean;
  /** Keyboard navigation and the ARIA roles on the slides and dots. */
  accessibility: boolean;
  /** `0` keeps the slides as they are; `1` wraps each one in two extra `div`s. */
  rows: number;
  centerMode: boolean;
  centerPadding: string;
  variableWidth: boolean;
  focusOnSelect: boolean;
  /** Lazy images (`img[data-lazy]`) load as their slides come into view. */
  lazyLoad: "ondemand";
}

/** What a slider event reports about the slider that fired it. */
export interface SliderEventDetail {
  /** The slides, clones excluded. */
  slides: HTMLElement[];
  /** Index of the current slide when the event fires. */
  currentSlide: number;
  /** For `beforeChange`, the slide being moved to; for every other event, `currentSlide`. */
  nextSlide: number;
}

export type SliderEventName =
  | "init"
  | "beforeChange"
  | "afterChange"
  | "breakpoint"
  | "setPosition";

/** What the ARIA layer of a slider is set up with; the Carousel and the Section differ in these. */
export interface SliderAccessibilityOptions {
  /** `id` of the slider; the arrows and the pause control point at it. */
  regionId: string;
  regionLabel: string;
  /** The `id` of a slide is this prefix, a dash and its index; the dots point at it. */
  slideIdPrefix: string;
  /** Where the arrows, dots and pause control are looked up: in the slider or in its parent. */
  controls: "slider" | "parent";
  /** Keeps the arrows in the tab order and mirrors `slick-disabled` into `aria-disabled`. */
  focusableArrows: boolean;
  /** `dataset` key that keeps the `tabindex` of the focusable elements of a hidden slide. */
  tabindexKey: string;
}

export interface SliderHandle {
  /** Listens to the slider; `init` fires during `mount`, so it is attached before it. */
  on: (
    name: SliderEventName,
    listener: (detail: SliderEventDetail) => void
  ) => void;
  /** Builds the slider in the page; called once, after the `init` listeners are attached. */
  mount: () => void;
  play: () => void;
  pause: () => void;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  /** Measures the slider again and lays it out. */
  setPosition: () => void;
  /** Adds the ARIA layer; called once the controls of the slider are in place. */
  setupAccessibility: (options: SliderAccessibilityOptions) => void;
}
