import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./toolbarExtend";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
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

  return renderStyles({ v, vs, vd, styles });
}
