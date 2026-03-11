import $ from "jquery";
import { initHoverAnimation } from "visual/libs/hoveranimation/utils";
import {
  attachSliderControls,
  makePausePlayItem
} from "../../utils/export/slider";

const SECTION_SLIDER_CLASS = "brz-slick-slider__section";
const sliderPausedState = new WeakMap<Element, boolean>();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const element = entry.target;
      const isPaused = sliderPausedState.get(element) ?? false;
      if (entry.isIntersecting && !isPaused) {
        $(element).slick("slickPlay");
      } else {
        $(element).slick("slickPause");
      }
    });
  },
  { threshold: 0.5 }
);

export default function ($node: JQuery) {
  const isRtl = $node.closest("[dir='rtl']").length > 0;
  const makeArrow = (node: HTMLElement) => {
    const $svg = $(node).children(".brz-icon-svg");

    if (!$svg.length) return () => "";

    const $clone = $svg.clone().removeClass("brz-hidden");
    const svgHTML = $clone[0].outerHTML;

    $svg.remove();

    return (className: string) => {
      return `<div class="brz-slick-slider__arrow ${className}">${svgHTML}</div>`;
    };
  };

  const makeCustomDots = (node: HTMLElement) => {
    const customSvgElement = node.querySelector(".brz-carousel-dot-custom");

    if (!customSvgElement) return null;

    const clonedElement = customSvgElement.cloneNode(true) as HTMLElement;
    clonedElement.classList.remove("brz-hidden");
    const outerHTML = clonedElement.outerHTML;

    customSvgElement.classList.add("brz-hidden");

    return outerHTML;
  };

  const handleClickPlay = ($this: JQuery<Element>) => {
    $this.slick("slickPlay");
    $this.attr("data-slider-paused", "false");
    sliderPausedState.set($this[0], false);
  };

  const handleClickPause = ($this: JQuery<Element>) => {
    $this.slick("slickPause");
    $this.attr("data-slider-paused", "true");
    sliderPausedState.set($this[0], true);
  };

  $node.find(".brz-carousel__slider").each(function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    const $this = $(this);
    const data = $this.data();
    const slidesToShow = data.slidesToShow;
    const slidesToScroll = data.slidesToScroll;
    const dots = data.dots;
    const dotsClass = data.dotsClass;
    const arrows = data.arrows;
    const fade = data.fade;
    const vertical = data.vertical;
    const autoPlay = data.autoPlay;
    const autoPlaySpeed = data.autoPlaySpeed;
    const transitionSpeed = data.transitionSpeed;
    const swipe = data.swipe;
    const responsive = JSON.parse(decodeURIComponent(data.responsive));
    const playPauseItem = makePausePlayItem(_this);

    const isInsideSectionSlider = !!$this.closest(`.${SECTION_SLIDER_CLASS}`).length;

    $this.on("init", function () {
      initHoverAnimation(_this);
      $this.find(".brz-image__lightbox").each(function () {
        this.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const aTag = this.querySelector("a");

          if (aTag) {
            $(this)
              // @ts-expect-error magnificPopup have no types
              .magnificPopup({
                delegate: "a",
                type: "image",
                closeOnContentClick: true
              })
              .magnificPopup("open");
          }
        });
      });

      const $dots = $this.find(".brz-slick-slider__dots");
      if ($dots.length && playPauseItem) {
        $dots.append(playPauseItem);
        attachSliderControls(
          $this,
          playPauseItem,
          handleClickPause,
          handleClickPlay
        );
      }

      window.Brz.emit("elements.carousel.ready", $this);
    });

    const customDotIcon = makeCustomDots(_this);
    const getArrow = makeArrow(_this);

    sliderPausedState.set(_this, false);

    const initCarouselSlick = () => {
      const $slick = $this.slick({
        slidesToShow,
        slidesToScroll,
        swipe,
        dots,
        dotsClass,
        arrows,
        fade,
        vertical,
        responsive,
        useTransform: false,
        speed: transitionSpeed * 100,
        draggable: swipe,
        nextArrow: arrows && getArrow("brz-slick-slider__arrow-next"),
        prevArrow: arrows && getArrow("brz-slick-slider__arrow-prev"),
        customPaging: customDotIcon
          ? () => `<button>${customDotIcon}</button>`
          : undefined,
        autoplay: false,
        autoplaySpeed: autoPlaySpeed,
        rtl: isRtl
      });

      if (autoPlay) {
        observer.observe(_this);
      }

      window.Brz.emit("elements.slick.ready", {
        slick: $this.get(0)
      });

      const elements = [
        "elements.tabs.changed",
        "elements.accordion.changed",
        "elements.switcher.changed",
        "elements.mmenu.panel.opened"
      ];

      elements.forEach((id) => {
        window.Brz.on(id, (element: Element) => {
          if (element && element.contains(_this)) {
            $slick.slick("setPosition");
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
            !wrapper ||
            !wrapper.querySelector(`.${SECTION_SLIDER_CLASS}`) ||
            !wrapper.contains(_this) ||
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
