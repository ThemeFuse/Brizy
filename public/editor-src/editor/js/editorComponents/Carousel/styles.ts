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
      standart: ["cssStyleElementCarouselColorDots"]
    },
    ".brz && .brz-carousel__slider .brz-slick-slider__arrow": {
      standart: ["cssStyleElementCarouselColorArrow"]
    },
    ".brz && .brz-carousel__slider .brz-slick-slider__arrow-prev": {
      standart: ["cssStyleElementCarouselPrev"]
    },
    ".brz && .brz-carousel__slider .brz-slick-slider__arrow-next": {
      standart: ["cssStyleElementCarouselNext"]
    }
  };

  return renderStyles({ ...data, styles });
}
