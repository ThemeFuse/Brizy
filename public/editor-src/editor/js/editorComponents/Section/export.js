import $ from "jquery";
import "slick-carousel";

export default function($node) {
  const isRtl = $node.find("html").attr("dir") === "rtl";
  const makeArrow = node => {
    const $svg = $(node)
      .children(".brz-icon-svg")
      .removeClass("brz-hidden");

    // Delete Svg
    $(node)
      .children(".brz-icon-svg")
      .remove();

    return className => {
      return `<div class="brz-slick-slider__arrow ${className}">${$svg[0].outerHTML}</div>`;
    };
  };

  $node.find(".brz-slick-slider, .brz-carousel__slider").each(function() {
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
    const swipe = data.swipe;
    const responsive = JSON.parse(decodeURIComponent(data.responsive));

    $this.on("init", function() {
      $node.find(".brz-icon-svg", _this).brzThemeIcon({ forceInit: true });
    });

    $this.on("breakpoint", function() {
      $node.find(".brz-icon-svg", _this).brzThemeIcon();
    });

    const getArrow = makeArrow(_this);

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
      draggable: swipe,
      nextArrow: arrows && getArrow("brz-slick-slider__arrow-next"),
      prevArrow: arrows && getArrow("brz-slick-slider__arrow-prev"),
      autoplay: autoPlay,
      autoplaySpeed: autoPlaySpeed,
      rtl: isRtl
    });
  });
}
