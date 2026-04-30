import $ from "jquery";
import {
  attachSliderControls,
  makePausePlayItem
} from "../../utils/export/slider";
import { SectionSliderAccessibility } from "../accessibility";

export default function ($node) {
  const isRtl = $node.closest("[dir='rtl']").length > 0;
  let sectionSliderInstance = 0;
  const makeArrow = (node) => {
    const $svg = $(node).children(".brz-icon-svg");

    if (!$svg.length) return () => "";

    const $clone = $svg.clone().removeClass("brz-hidden");
    const svgHTML = $clone[0].outerHTML;

    $svg.remove();

    return (className) => {
      const isNext = className.includes("next");
      const ariaLabel = isNext ? "Next slide" : "Previous slide";

      return `<button type="button" class="brz-slick-slider__arrow ${className}" aria-label="${ariaLabel}">${svgHTML}</button>`;
    };
  };

  const handleClickPlay = ($this) => {
    $this.slick("slickPlay");
    $this.attr("data-slider-paused", "false");
  };

  const handleClickPause = ($this) => {
    $this.slick("slickPause");
    $this.attr("data-slider-paused", "true");
  };

  $node.find(".brz-slick-slider__section").each(function () {
    const _this = this;
    const $this = $(this);
    const data = $this.data();
    const slidesToShow = data.slidesToShow;
    const slidesToScroll = data.slidesToScroll;
    const dots = data.dots;
    const dotsClass = data.dotsClass;
    const arrows = data.arrows;
    const fade = data.fade;
    const speed = data.animationSpeed;
    const vertical = data.vertical;
    const autoPlay = data.autoPlay;
    const autoPlaySpeed = data.autoPlaySpeed;
    const swipe = data.swipe;
    const section = $this.closest(".brz-section").get(0);
    const responsive = JSON.parse(decodeURIComponent(data.responsive));

    const playPauseItem = makePausePlayItem(_this);
    const instanceId = sectionSliderInstance++;

    const getArrow = makeArrow(_this);

    $this.on("init", function (event, slick) {
      if (window.Brz) {
        const node = slick.$slides[0];

        if (!node || !section) {
          return;
        }

        window.Brz.emit("elements.slick.ready", {
          slick: node,
          wrapper: section
        });
      }
      const $dots = $this.find(
        ".brz-slick-slider__dots:not(.brz-carousel__slider .brz-slick-slider__dots)"
      );

      if ($dots.length && playPauseItem) {
        $dots.append(playPauseItem);
        attachSliderControls(
          $this,
          playPauseItem,
          handleClickPause,
          handleClickPlay
        );
      }
    });

    $this.on("afterChange", function (event, slick, currentSlide) {
      if (window.Brz) {
        const _slick = slick.$slides[currentSlide];

        if (!_slick || !section) {
          return;
        }

        window.Brz.emit("elements.section.slide.change", {
          slick: _slick,
          node: section
        });
      }
    });

    $this.attr("data-slider-paused", "false");

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
      speed,
      draggable: swipe,
      nextArrow: arrows && getArrow("brz-slick-slider__arrow-next"),
      prevArrow: arrows && getArrow("brz-slick-slider__arrow-prev"),
      autoplay: autoPlay,
      autoplaySpeed: autoPlaySpeed,
      rtl: isRtl,
      accessibility: false,
      rows: 0,
      pauseOnFocus: false
    });

    const sectionSliderAccessibility = new SectionSliderAccessibility({
      slick: $slick,
      instanceId
    });
    sectionSliderAccessibility.init();
  });
}
