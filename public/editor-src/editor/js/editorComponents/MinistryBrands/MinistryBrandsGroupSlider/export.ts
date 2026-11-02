import { getFreeLibs } from "visual/libs";
import {
  DEFAULT_NEXT_ARROW,
  DEFAULT_PREV_ARROW
} from "visual/utils/export/slider";
import { makeAttr } from "visual/utils/i18n/attribute";
import * as Num from "visual/utils/reader/number";

export default function (node: HTMLElement): void {
  const { createSlider } = getFreeLibs();

  node
    .querySelectorAll<HTMLElement>(".brz-groupSlider-swiper-wrapper")
    .forEach((wrapper) => {
      const slidesToShow = wrapper.getAttribute(makeAttr("show")) ?? undefined;
      const dots =
        Num.read(wrapper.getAttribute(makeAttr("pagination")) ?? undefined) ===
        1;

      const container = wrapper.closest(".brz-groupSlider_wrap");
      const showarrows =
        Num.read(
          container?.getAttribute(makeAttr("showarrows")) ?? undefined
        ) === 1;

      const prevArrow =
        container?.querySelector<HTMLElement>(".brz-swiper-arrow_prev") ??
        undefined;
      const nextArrow =
        container?.querySelector<HTMLElement>(".brz-swiper-arrow_next") ??
        undefined;

      createSlider(wrapper, {
        slidesToShow: slidesToShow ?? 1,
        slidesToScroll: 1,
        dotsClass: "brz-slick-slider__dots",
        // Without an arrow in the markup the slider builds its own.
        nextArrow: showarrows && (nextArrow ?? DEFAULT_NEXT_ARROW),
        prevArrow: showarrows && (prevArrow ?? DEFAULT_PREV_ARROW),
        dots,
        customPaging: undefined,
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
        ],
        infinite: true,
        fade: false,
        vertical: false,
        rtl: false,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        pauseOnFocus: true,
        arrows: true,
        swipe: true,
        draggable: true,
        touchThreshold: 5,
        useTransform: true,
        accessibility: true,
        rows: 1,
        centerMode: false,
        centerPadding: "50px",
        variableWidth: false,
        focusOnSelect: false,
        lazyLoad: "ondemand"
      }).mount();
    });
}
