import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz && .brz-carousel__slider": {
      standart: ["cssStyleElementCarouselPaddingLeftRight"]
    },
    ".brz && .brz-carousel__slider .slick-list": {
      standart: ["cssStyleElementCarouselMarginPadding"]
    },
    ".brz && .brz-carousel__slider .slick-list .slick-track .slick-slide": {
      standart: ["cssStyleElementCarouselSpacing"]
    },
    ".brz && .brz-carousel__slider .brz-slick-slider__dots": {
      standart: [
        "cssStyleElementCarouselColorDots",
        "cssStyleElementCarouselBgColorNavigation",
        "cssStyleElementCarouselNavigationBgPadding",
        "cssStyleElementCarouselBgGradientNavigation"
      ]
    },
    ".brz && .brz-carousel__slider .brz-slick-slider__dots .brz-icon-svg-custom":
      {
        standart: ["cssStyleElementCarouselColorCustomDots"]
      },
    ".brz && .brz-carousel__slider .brz-slick-slider__pause": {
      standart: ["cssStyleElementCarouselColorPause"]
    },
    ".brz && .brz-carousel__slider .brz-slick-slider__arrow": {
      standart: [
        "cssStyleElementCarouselColorArrow",
        "cssStyleElementCarouselArrowSize",
        "cssStyleElementCarouselBgColorNavigation",
        "cssStyleElementCarouselBgGradientNavigation",
        "cssStyleElementCarouselNavigationBgPadding"
      ]
    },
    ".brz && .brz-carousel__slider .brz-slick-slider__arrow .brz-icon-svg-custom ":
      {
        standart: ["cssStyleElementCarouselColorCustomArrow"]
      },
    ".brz && .brz-carousel__slider .brz-slick-slider__arrow-prev": {
      standart: ["cssStyleElementCarouselPrev"]
    },
    ".brz && .brz-carousel__slider .brz-slick-slider__arrow-next": {
      standart: ["cssStyleElementCarouselNext"]
    },
    ".brz && .brz-carousel__slider.brz-carousel__slider--arrows-custom-position  .brz-slick-slider__arrow-prev":
      {
        standart: ["cssStyleElementCarouselArrowPositionPrev"]
      },
    ".brz && .brz-carousel__slider.brz-carousel__slider--arrows-custom-position .brz-slick-slider__arrow-next":
      {
        standart: ["cssStyleElementCarouselArrowPositionNext"]
      }
  };

  return renderStyles({ ...data, styles });
}
