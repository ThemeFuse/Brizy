import $ from "jquery";

export default function ($node) {
  const isRtl = $node.closest("[dir='rtl']").length > 0;
  const makeArrow = (node) => {
    const $svg = $(node).children(".brz-icon-svg").removeClass("brz-hidden");

    // Delete Svg
    $(node).children(".brz-icon-svg").remove();

    return (className) => {
      return `<div class="brz-slick-slider__arrow ${className}">${$svg[0].outerHTML}</div>`;
    };
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

    $this.slick({
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
      rows: 0
    });
  });
}
