import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const { maskShape = "none" } = v;

  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz && .brz-ministryBrands.brz-groupSlider": {
      standart: ["cssStylePaddingBG"]
    },
    ".brz && .brz-groupSlider-swiper-slide": {
      standart: [
        "cssStyleElementMinistryGroupSliderItemsBetween",
        "cssStyleElementMinistryGroupSliderSlidesToShow"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsImageWidth",
        "cssStyleElementOfMinistryBrandsImagePadding",
        "cssStyleElementOfMinistryBrandsImgBorder",
        ...(maskShape === "none"
          ? []
          : ["cssStyleElementOfMinistryBrandsImgMaskShadow"])
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover::after": {
      standart: [
        "cssStyleElementOfMinistryBrandsImgBgColor",
        "cssStyleElementOfMinistryBrandsImgBgGradient",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat",
        "cssStyleMinistryElementMediaBorderRadius",
        ...(maskShape === "none"
          ? ["cssStyleElementOfMinistryBrandsImgBoxShadow"]
          : [])
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover :is(img, video, iframe)": {
      standart: [
        "cssStyleElementOfMinistryBrandsImgFilters",
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info:hover": {
      standart: [
        "cssStyleBorderRadius",
        "cssStylementOfMinistryBrandsParentBgColor",
        "cssStylementOfMinistryBrandsParentBgGradient",
        "cssStylementOfMinistryBrandsParentBorder",
        "cssStylementOfMinistryBrandsParentBoxShadow",
        "cssStyleElementMinistryGroupSliderItemsAlign"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info .brz-ministryBrands__item--media":
      {
        standart: ["cssStyleElementMinistryGroupSliderItemsImageAlign"]
      },
    ".brz && .brz-slick-slider__dots li.slick-active": {
      standart: ["cssStyleElementMinistryGroupSliderDotsColorColorActive"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-slick-slider__dots li:not(.slick-active):hover": {
      standart: ["cssStyleElementMinistryGroupSliderDotsColorColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info .brz-groupSlider_heading:hover":
      {
        standart: [
          "cssStyleElementMinistryGroupSliderTitleSpacing",
          "cssStyleElementOfMinistryBrandsTitleTypography",
          "cssStyleElementOfMinistryBrandsTitleColor"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info .brz-groupSlider_meta:hover":
      {
        standart: [
          "cssStyleElementMinistryGroupSliderMetaTypography",
          "cssStyleElementOfMinistryBrandsMetaColor"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info > *:not(:last-child)":
      {
        standart: ["cssStyleElementMinistryGroupSliderMetaSpacing"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info p:hover": {
      standart: [
        "cssStyleElementMinistryGroupSliderMetaTypography",
        "cssStyleElementOfMinistryBrandsMetaColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-ministryBrands__item--media :is(img,video,iframe)": {
      standart: ["cssStyleMinistryElementMediaBorderRadius"]
    },
    ".brz && .brz-swiper-arrow_prev:hover": {
      standart: [
        "cssStyleElementMinistryGroupSliderArrowSize",
        "cssStyleElementMinistryGroupSliderArrowColor",
        "cssStyleElementMinistryGroupSliderArrowSpacingLeft"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-swiper-arrow_next:hover": {
      standart: [
        "cssStyleElementMinistryGroupSliderArrowSize",
        "cssStyleElementMinistryGroupSliderArrowColor",
        "cssStyleElementMinistryGroupSliderArrowSpacingRight"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info .brz-groupSlider_detail_button .brz-button:hover":
      {
        standart: [
          "cssStyleElementMinistryGroupSliderButtonSize",
          "cssStyleElementMinistryGroupSliderButtonWidth",
          "cssStyleElementMinistryGroupSliderButtonTypography",
          "cssStyleElementMinistryGroupSliderButtonColor",
          "cssStyleElementMinistryGroupSliderButtonBgColor",
          "cssStyleElementMinistryGroupSliderButtonBgGradient",
          "cssStyleElementMinistryGroupSliderButtonBorder",
          "cssStyleElementMinistryGroupSliderButtonBorderRadius",
          "cssStyleElementMinistryGroupSliderButtonBoxShadow"
        ],
        interval: ["cssStyleHoverTransition"]
      }
  };

  return renderStyles({ v, vs, vd, styles });
}
