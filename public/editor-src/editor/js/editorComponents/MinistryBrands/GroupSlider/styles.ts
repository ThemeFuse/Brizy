import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";

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
    ".brz && .brz-ministryBrands.brz-groupSlider": {
      standart: ["cssStylePaddingBG"]
    },
    ".brz && .brz-groupSlider-swiper-slide": {
      standart: [
        "cssStyleElementMinistryGroupSliderItemsBetween",
        "cssStyleElementMinistryGroupSliderSlidesToShow"
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
          "cssStyleElementMinistryGroupSliderMetaSpacing",
          "cssStyleElementMinistryGroupSliderMetaTypography",
          "cssStyleElementOfMinistryBrandsMetaColor"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info p:hover": {
      standart: [
        "cssStyleElementMinistryGroupSliderMetaSpacing",
        "cssStyleElementMinistryGroupSliderMetaTypography",
        "cssStyleElementOfMinistryBrandsMetaColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-image img": {
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
