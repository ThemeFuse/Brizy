import { CAROUSEL_HTML } from "./fixtures/slider/carousel";
import { SECTION_NESTED_HTML } from "./fixtures/slider/section-nested";

// Markup the slider exports run on, as the compiler outputs it.

const parse = (html: string): HTMLTemplateElement => {
  const template = document.createElement("template");

  template.innerHTML = html;

  return template;
};

const setAttributes = (
  template: HTMLTemplateElement,
  selector: string,
  attributes: Record<string, string>
): void => {
  const element = template.content.querySelector(selector);

  if (!element) {
    throw new Error(`fixture has no ${selector}`);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
};

const serialize = (template: HTMLTemplateElement): string => template.innerHTML;

/** The compiled Section slider with a nested Carousel in slides 1 and 3 and a Counter in slide 2. */
export function sectionNested(attributes: Record<string, string>): string {
  const template = parse(SECTION_NESTED_HTML);

  setAttributes(template, ".brz-slick-slider__section", attributes);

  return serialize(template);
}

/** The same Section slider with the nested carousels removed; slide 2 keeps its Counter. */
export function sectionPlain(attributes: Record<string, string>): string {
  const template = parse(SECTION_NESTED_HTML);

  template.content
    .querySelectorAll(".brz-slick-slider__section .brz-carousel")
    .forEach((carousel) => {
      carousel.closest(".brz-wrapper")?.remove();
    });
  setAttributes(template, ".brz-slick-slider__section", attributes);

  return serialize(template);
}

export interface CarouselControls {
  /** The hidden pause / play icons `Carousel/Items` renders when "stop slider" is on. */
  pausePlay: boolean;
  /** The hidden custom dot icon rendered for a custom dots style. */
  customDot: boolean;
}

/** The compiled standalone Carousel, optionally with the icons of the pause control / custom dots. */
export function carousel(
  attributes: Record<string, string>,
  controls: CarouselControls
): string {
  const template = parse(CAROUSEL_HTML);
  const slider = template.content.querySelector(".brz-carousel__slider");

  setAttributes(template, ".brz-carousel__slider", attributes);

  // Same order as `Carousel/Items` renders them: custom dot, then pause, then play.
  if (controls.customDot) {
    slider?.insertAdjacentHTML(
      "beforeend",
      '<svg class="brz-icon-svg brz-carousel-dot-custom brz-hidden"><use href="/static/editor/icons/glyph/star.svg#nc_icon"></use></svg>'
    );
  }

  if (controls.pausePlay) {
    slider?.insertAdjacentHTML(
      "beforeend",
      '<svg class="brz-icon-svg brz-hidden button-pause"><use href="/static/editor/icons/glyph/button-circle-pause.svg#nc_icon"></use></svg><svg class="brz-icon-svg brz-hidden button-play"><use href="/static/editor/icons/glyph/button-circle-play.svg#nc_icon"></use></svg>'
    );
  }
  return serialize(template);
}

export const encodeResponsive = (value: unknown): string =>
  encodeURIComponent(JSON.stringify(value));

const ARROW_ICON =
  '<svg class="brz-icon-svg brz-hidden"><use href="/static/editor/icons/editor/right-arrow-thin.svg#brz_icon"></use></svg>';
const REPLAY_ICON =
  '<svg class="brz-icon-svg brz-hidden"><use href="/static/editor/icons/glyph/undo-29.svg#nc_icon"></use></svg>';

const COUNTER =
  '<div class="brz-wrapper"><div data-brz-start="0" data-brz-end="100" data-brz-duration="2" data-brz-separator="," data-brz-type="simple" class="brz-counter brz-counter-simple"><div class="brz-counter-figures" role="status" aria-live="polite" aria-atomic="true"><span class="brz-counter-numbers">0</span></div></div></div>';

export interface StoryOptions {
  loop: boolean;
  autoPlay: boolean;
  slides: number;
  /** 1-based index of the slide that holds a Counter, or 0 for none. */
  counterSlide: number;
  /** 1-based index of the slide with a button linking to slide 3, or 0 for none. */
  linkSlide: number;
}

const storySlide = (index: number, options: StoryOptions): string => {
  const counter = options.counterSlide === index ? COUNTER : "";
  const link =
    options.linkSlide === index
      ? '<div class="brz-wrapper"><a class="brz-a brz-btn" href="#" data-brz-link-story="3"><span class="brz-span brz-text__editor">To 3</span></a></div>'
      : "";

  return `<div class="brz-section__content"><div class="brz-container"><div class="brz-wrapper"><p class="brz-tp-paragraph">Slide ${index}</p></div>${counter}${link}</div><div class="brz-slick-slider__inner-arrow brz-slick-slider__inner-arrow-next"></div><div class="brz-slick-slider__inner-arrow brz-slick-slider__inner-arrow-prev"></div></div>`;
};

/** A Story block as `Story/Items.jsx` renders it for view. */
export function story(options: StoryOptions): string {
  const responsive = [
    {
      breakpoint: 767,
      settings: { centerPadding: "40px", slidesToShow: 1, speed: 300 }
    }
  ];
  const slides = Array.from({ length: options.slides }, (_, i) =>
    storySlide(i + 1, options)
  ).join("");

  return `<section class="brz-section brz-story"><div class="brz-slick-slider brz-slick-slider__story" data-center-mode="true" data-center-padding="60px" data-variable-width="true" data-focus-on-select="true" data-slider-loop="${options.loop}" data-touch-threshold="15" data-slides-to-scroll="1" data-arrows="true" data-dots="true" data-dots-class="brz-slick-slider__dots" data-fade="false" data-vertical="false" data-auto-play="${options.autoPlay}" data-auto-play-speed="5000" data-swipe="true" data-responsive="${encodeResponsive(responsive)}" data-speed="300">${slides}${ARROW_ICON}${REPLAY_ICON}</div></section>`;
}

export interface GroupSliderOptions {
  /** `data-brz-show`, read as a string by the export. */
  show: string;
  pagination: boolean;
  showArrows: boolean;
  slides: number;
}

/** The Ministry Brands group slider markup, reduced to what the export reads. */
export function groupSlider(options: GroupSliderOptions): string {
  const slides = Array.from(
    { length: options.slides },
    (_, i) =>
      `<div class="brz-groupSlider-swiper-slide"><div class="brz-groupSlider-info"><h4 class="brz-groupSlider_heading">Group ${i + 1}</h4><div class="brz-groupSlider_detail_button"><a class="brz-button" href="/group-${i + 1}">View</a></div></div></div>`
  ).join("");

  return `<div class="brz-ministryBrands brz-groupSlider"><div class="brz-groupSlider__wrapper"><div class="brz-groupSlider_wrap" data-brz-showarrows="${options.showArrows ? 1 : 0}"><div class="brz-groupSlider-swiper-container"><div class="brz-groupSlider-swiper-wrapper" data-brz-show="${options.show}" data-brz-pagination="${options.pagination ? 1 : 0}">${slides}</div></div><div class="brz-swiper-arrow brz-swiper-arrow_prev"><svg class="brz-icon-svg"></svg></div><div class="brz-swiper-arrow brz-swiper-arrow_next"><svg class="brz-icon-svg"></svg></div></div></div></div>`;
}
