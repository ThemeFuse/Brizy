import { getFreeLibs } from "visual/libs";
import { initHoverAnimation } from "visual/libs/hoveranimation/utils";
import type { SliderHandle } from "visual/libs/slider";
import { sliderDataSchema } from "visual/utils/export/schemas";
import {
  appendToEach,
  attachSliderControls,
  DEFAULT_NEXT_ARROW,
  DEFAULT_PREV_ARROW,
  makePausePlayItem,
  readBreakpoints,
  readDataAttributes
} from "../../utils/export/slider";

const SECTION_SLIDER_CLASS = "brz-slick-slider__section";
const sliderPausedState = new WeakMap<Element, boolean>();
const sliders = new WeakMap<Element, SliderHandle>();
let carouselInstance = 0;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const element = entry.target;
      const isPaused = sliderPausedState.get(element) ?? false;
      if (entry.isIntersecting && !isPaused) {
        sliders.get(element)?.play();
      } else {
        sliders.get(element)?.pause();
      }
    });
  },
  { threshold: 0.5 }
);

export default function (node: HTMLElement) {
  const { openLightbox, handleLightBoxZoom, createSlider } = getFreeLibs();
  const isRtl = node.closest("[dir='rtl']") !== null;
  const makeArrow = (slider: HTMLElement) => {
    const icons = Array.from(slider.children).filter((child) =>
      child.matches(".brz-icon-svg")
    );
    const [first] = icons;

    if (!first) return () => "";

    const clone = first.cloneNode(true);
    const svg = clone instanceof Element ? clone : undefined;

    svg?.classList.remove("brz-hidden");
    const svgHTML = svg?.outerHTML ?? "";

    icons.forEach((icon) => {
      icon.remove();
    });

    return (className: string) => {
      const isNext = className.includes("next");
      const ariaLabel = isNext ? "Next slide" : "Previous slide";

      return `<button type="button" class="brz-slick-slider__arrow ${className}" aria-label="${ariaLabel}">${svgHTML}</button>`;
    };
  };

  const makeCustomDots = (slider: HTMLElement): string | undefined => {
    const customSvgElement = slider.querySelector(".brz-carousel-dot-custom");

    if (!customSvgElement) return undefined;

    const clonedElement = customSvgElement.cloneNode(true);

    if (!(clonedElement instanceof Element)) return undefined;

    clonedElement.classList.remove("brz-hidden");
    const outerHTML = clonedElement.outerHTML;

    customSvgElement.classList.add("brz-hidden");

    return outerHTML;
  };

  const handleClickPlay = (slider: HTMLElement) => {
    sliders.get(slider)?.play();
    slider.setAttribute("data-slider-paused", "false");
    sliderPausedState.set(slider, false);
  };

  const handleClickPause = (slider: HTMLElement) => {
    sliders.get(slider)?.pause();
    slider.setAttribute("data-slider-paused", "true");
    sliderPausedState.set(slider, true);
  };

  node
    .querySelectorAll<HTMLElement>(".brz-carousel__slider")
    .forEach((slider) => {
      const data = sliderDataSchema.parse(readDataAttributes(slider));
      const responsive = readBreakpoints(data.responsive);
      const playPauseItem = makePausePlayItem(slider);
      const instanceId = carouselInstance++;

      const isInsideSectionSlider =
        slider.closest(`.${SECTION_SLIDER_CLASS}`) !== null;

      // After the build: hover animation, lightbox, play/pause in the dots, ready event.
      const afterSlickInit = () => {
        initHoverAnimation(slider);

        slider
          .querySelectorAll<HTMLElement>(".brz-image__lightbox")
          .forEach((lightbox) => {
            lightbox.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();

              const aTag = lightbox.querySelector("a");

              if (aTag) {
                openLightbox({
                  kind: "element",
                  target: lightbox,
                  options: {
                    delegate: "a",
                    type: "image",
                    gallery: undefined,
                    closeOnContentClick: true,
                    mainClass: "",
                    callbacks: { open: handleLightBoxZoom, close: undefined }
                  }
                }).open();
              }
            });
          });

        const dots = Array.from(
          slider.querySelectorAll(".brz-slick-slider__dots")
        );
        if (dots.length && playPauseItem) {
          appendToEach(dots, playPauseItem);
          attachSliderControls(
            playPauseItem,
            () => handleClickPause(slider),
            () => handleClickPlay(slider)
          );
        }

        window.Brz.emit("elements.carousel.ready", slider);
      };

      const customDotIcon = makeCustomDots(slider);
      const getArrow = makeArrow(slider);
      // Without `data-arrows` the slider builds its own arrows.
      const arrow = (className: string, fallback: string) =>
        data.arrows === undefined
          ? fallback
          : data.arrows && getArrow(className);

      sliderPausedState.set(slider, false);
      slider.setAttribute("data-slider-paused", "false");

      const initCarouselSlick = () => {
        const handle = createSlider(slider, {
          slidesToShow: data.slidesToShow ?? 1,
          slidesToScroll: data.slidesToScroll ?? 1,
          swipe: data.swipe ?? true,
          dots: data.dots ?? false,
          dotsClass: data.dotsClass ?? "slick-dots",
          arrows: data.arrows ?? true,
          fade: data.fade ?? false,
          vertical: data.vertical ?? false,
          responsive,
          useTransform: false,
          speed: Number(data.transitionSpeed) * 100,
          draggable: data.swipe ?? true,
          nextArrow: arrow("brz-slick-slider__arrow-next", DEFAULT_NEXT_ARROW),
          prevArrow: arrow("brz-slick-slider__arrow-prev", DEFAULT_PREV_ARROW),
          customPaging: customDotIcon
            ? () => `<button>${customDotIcon}</button>`
            : undefined,
          autoplay: false,
          autoplaySpeed: data.autoPlaySpeed ?? 3000,
          rtl: isRtl,
          accessibility: false,
          pauseOnFocus: false,
          pauseOnHover: true,
          infinite: true,
          touchThreshold: 5,
          rows: 1,
          centerMode: false,
          centerPadding: "50px",
          variableWidth: false,
          focusOnSelect: false,
          lazyLoad: "ondemand"
        });

        handle.mount();

        sliders.set(slider, handle);

        afterSlickInit();

        handle.setupAccessibility({
          regionId: `brz-carousel-${instanceId}`,
          regionLabel: `Carousel ${instanceId + 1}`,
          slideIdPrefix: `brz-carousel-slide-${instanceId}`,
          controls: "parent",
          focusableArrows: false,
          tabindexKey: "brzCarouselTabindex"
        });

        if (data.autoPlay) {
          observer.observe(slider);
        }

        window.Brz.emit("elements.slick.ready", {
          slick: slider
        });

        const elements = [
          "elements.tabs.changed",
          "elements.accordion.changed",
          "elements.switcher.changed",
          "elements.mmenu.panel.opened"
        ];

        elements.forEach((id) => {
          window.Brz.on(id, (element: Element) => {
            if (element?.contains(slider)) {
              handle.setPosition();
            }
          });
        });
      };

      if (isInsideSectionSlider) {
        let inited = false;

        window.Brz.on(
          "elements.slick.ready",
          (payload: { wrapper?: Element }) => {
            const wrapper = payload?.wrapper;
            if (
              !wrapper?.querySelector(`.${SECTION_SLIDER_CLASS}`) ||
              !wrapper.contains(slider) ||
              inited
            ) {
              return;
            }
            inited = true;
            initCarouselSlick();
          }
        );
      } else {
        initCarouselSlick();
      }
    });
}
