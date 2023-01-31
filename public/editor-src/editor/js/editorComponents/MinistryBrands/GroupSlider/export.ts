import $ from "jquery";
import * as Num from "visual/utils/reader/number";

export default function ($node: JQuery): void {
  $node.find(".brz-groupSlider-swiper-wrapper").each(function () {
    const $this = $(this);

    const $slidesToShow = $this.attr("data-show");
    const $dots = Num.read($this.attr("data-pagination")) === 1 ? true : false;

    // @ts-expect-error "slick" doesn't exist in .ts
    $this.slick({
      slidesToShow: $slidesToShow,
      slidesToScroll: 1,
      dotsClass: "brz-slick-slider__dots",
      nextArrow: $(".brz-swiper-arrow_next"),
      prevArrow: $(".brz-swiper-arrow_prev"),
      dots: $dots,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  });
}
