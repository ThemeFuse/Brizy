import $ from "jquery";
import { makeAttr } from "visual/utils/i18n/attribute";
import * as Num from "visual/utils/reader/number";

export default function ($node: JQuery): void {
  $node.find(".brz-groupSlider-swiper-wrapper").each(function () {
    const $this = $(this);

    const $slidesToShow = $this.attr(makeAttr("show"));
    const $dots = Num.read($this.attr(makeAttr("pagination"))) === 1;

    const container = $this.closest(".brz-groupSlider_wrap");
    const showarrows = Num.read(container.attr(makeAttr("showarrows"))) === 1;

    const prevArrow = container.find(".brz-swiper-arrow_prev")[0];
    const nextArrow = container.find(".brz-swiper-arrow_next")[0];

    $this.slick({
      slidesToShow: $slidesToShow,
      slidesToScroll: 1,
      dotsClass: "brz-slick-slider__dots",
      nextArrow: showarrows && nextArrow,
      prevArrow: showarrows && prevArrow,
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
