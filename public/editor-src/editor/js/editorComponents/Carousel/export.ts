import $ from "jquery";
import { initHoverAnimation } from "visual/libs/hoveranimation/utils";
import {
  attachSliderControls,
  makePausePlayItem
} from "../../utils/export/slider";

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const $slick = $(entry.target);
      const isPaused = $slick.attr("data-slider-paused") === "true";
      if (entry.isIntersecting && !isPaused) {
        $slick.slick("slickPlay");
      } else {
        $slick.slick("slickPause");
      }
    });
  },
  { threshold: 0.5 }
);

export default function ($node: JQuery) {
  const isRtl = $node.closest("[dir='rtl']").length > 0;
  const makeArrow = (node: HTMLElement) => {
    const $svg = $(node).children(".brz-icon-svg").removeClass("brz-hidden");

    if (!$svg.length) return () => "";
    // Delete Svg
    $(node).children(".brz-icon-svg").remove();

    return (className: string) => {
      return `<div class="brz-slick-slider__arrow ${className}">${$svg[0].outerHTML}</div>`;
    };
  };

  const makeCustomDots = (node: HTMLElement) => {
    const $customSvg = $(node)
      .find(".brz-carousel-dot-custom")
      .removeClass("brz-hidden");

    if (!$customSvg.length) return null;

    return $customSvg[0].outerHTML;
  };

  const handleClickPlay = ($this: JQuery<Element>) => {
    $this.slick("slickPlay");
    $this.attr("data-slider-paused", "false");
  };

  const handleClickPause = ($this: JQuery<Element>) => {
    $this.slick("slickPause");
    $this.attr("data-slider-paused", "true");
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

    $this.on("init", function () {
      initHoverAnimation(_this);
      // when preview is opening via mobile - slick init plugin - then destroy it
      // and init again. this steps remove click lightbox event inside slider.
      // So we should reinitialize lightbox manually
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

      window.Brz.emit("elements.carousel.ready");
    });

    const customDotIcon = makeCustomDots(_this);
    const getArrow = makeArrow(_this);

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

    // Need rearrange when changed some of elements [tabs, accordion, ... ]
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
  });
}
