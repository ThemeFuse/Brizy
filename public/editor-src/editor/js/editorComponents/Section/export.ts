import { getFreeLibs } from "visual/libs";
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
} from "visual/utils/export/slider";

const childIcons = (node: Element): Element[] =>
  Array.from(node.children).filter((child) => child.matches(".brz-icon-svg"));

export default function (node: HTMLElement): void {
  const { createSlider } = getFreeLibs();
  const isRtl = node.closest("[dir='rtl']") !== null;
  let sectionSliderInstance = 0;
  const makeArrow = (slider: Element) => {
    const icons = childIcons(slider);
    const [first] = icons;

    if (!first) return () => "";

    const clone = first.cloneNode(true);
    const svgHTML = clone instanceof Element ? clone : undefined;

    svgHTML?.classList.remove("brz-hidden");
    const html = svgHTML?.outerHTML ?? "";

    icons.forEach((icon) => {
      icon.remove();
    });

    return (className: string) => {
      const isNext = className.includes("next");
      const ariaLabel = isNext ? "Next slide" : "Previous slide";

      return `<button type="button" class="brz-slick-slider__arrow ${className}" aria-label="${ariaLabel}">${html}</button>`;
    };
  };

  const handleClickPlay = (slider: HTMLElement, handle: SliderHandle) => {
    handle.play();
    slider.setAttribute("data-slider-paused", "false");
  };

  const handleClickPause = (slider: HTMLElement, handle: SliderHandle) => {
    handle.pause();
    slider.setAttribute("data-slider-paused", "true");
  };

  node
    .querySelectorAll<HTMLElement>(".brz-slick-slider__section")
    .forEach((slider) => {
      const data = sliderDataSchema.parse(readDataAttributes(slider));
      const section = slider.closest(".brz-section") ?? undefined;
      const responsive = readBreakpoints(data.responsive);

      const playPauseItem = makePausePlayItem(slider);
      const instanceId = sectionSliderInstance++;

      const getArrow = makeArrow(slider);
      const swipe = data.swipe ?? true;
      // Without `data-arrows` the slider builds its own arrows.
      const arrow = (className: string, fallback: string) =>
        data.arrows === undefined
          ? fallback
          : data.arrows && getArrow(className);

      const sliderInstance = createSlider(slider, {
        slidesToShow: data.slidesToShow ?? 1,
        slidesToScroll: data.slidesToScroll ?? 1,
        infinite: true,
        swipe,
        dots: data.dots ?? false,
        dotsClass: data.dotsClass ?? "slick-dots",
        customPaging: undefined,
        arrows: data.arrows ?? true,
        fade: data.fade ?? false,
        vertical: data.vertical ?? false,
        responsive,
        useTransform: false,
        speed: data.animationSpeed ?? 500,
        draggable: swipe,
        touchThreshold: 5,
        nextArrow: arrow("brz-slick-slider__arrow-next", DEFAULT_NEXT_ARROW),
        prevArrow: arrow("brz-slick-slider__arrow-prev", DEFAULT_PREV_ARROW),
        autoplay: data.autoPlay ?? false,
        autoplaySpeed: data.autoPlaySpeed ?? 3000,
        rtl: isRtl,
        accessibility: false,
        rows: 0,
        pauseOnFocus: false,
        pauseOnHover: true,
        centerMode: false,
        centerPadding: "50px",
        variableWidth: false,
        focusOnSelect: false,
        lazyLoad: "ondemand"
      });

      sliderInstance.on("init", ({ slides }) => {
        if (window.Brz) {
          const first = slides[0];

          if (!first || !section) {
            return;
          }

          window.Brz.emit("elements.slick.ready", {
            slick: first,
            wrapper: section
          });
        }
        const dots = Array.from(
          slider.querySelectorAll(
            ".brz-slick-slider__dots:not(.brz-carousel__slider .brz-slick-slider__dots)"
          )
        );

        if (dots.length && playPauseItem) {
          appendToEach(dots, playPauseItem);
          attachSliderControls(
            playPauseItem,
            () => {
              handleClickPause(slider, sliderInstance);
            },
            () => {
              handleClickPlay(slider, sliderInstance);
            }
          );
        }
      });

      slider.setAttribute("data-slider-paused", "false");

      sliderInstance.mount();

      sliderInstance.on("afterChange", ({ slides, currentSlide }) => {
        if (window.Brz) {
          const _slick = slides[currentSlide];

          if (!_slick || !section) {
            return;
          }

          window.Brz.emit("elements.section.slide.change", {
            slick: _slick,
            node: section
          });
        }
      });

      sliderInstance.setupAccessibility({
        regionId: `brz-section-slider-${instanceId}`,
        regionLabel: `Section slider ${instanceId + 1}`,
        slideIdPrefix: `brz-section-slide-${instanceId}`,
        controls: "slider",
        focusableArrows: true,
        tabindexKey: "brzSectionSliderTabindex"
      });
    });
}
