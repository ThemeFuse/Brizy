import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v } = data;
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
        "cssStyleMinistryElementMediaBorderRadius",
        ...(maskShape === "none"
          ? ["cssStyleElementOfMinistryBrandsImgBoxShadow"]
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
        "cssStyleMaskRepeat"
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
    ".brz &&:hover .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info .brz-groupSlider_heading:hover":
      {
        standart: [
          "cssStyleElementOfMinistryBrandsTitleTypography",
          "cssStyleElementOfMinistryBrandsTitleColor"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-ministryBrands__item--meta-title": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemTitleMargin",
        "cssStyleElementMinistryBrandsMetaItemTitlePadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-day": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemDayMargin",
        "cssStyleElementMinistryBrandsMetaItemDayPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-times": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemTimesMargin",
        "cssStyleElementMinistryBrandsMetaItemTimesPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-category": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemCategoryMargin",
        "cssStyleElementMinistryBrandsMetaItemCategoryPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-group": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemGroupMargin",
        "cssStyleElementMinistryBrandsMetaItemGroupPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-status": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemStatusMargin",
        "cssStyleElementMinistryBrandsMetaItemStatusPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-childcare": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemChildcareMargin",
        "cssStyleElementMinistryBrandsMetaItemChildcarePadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-resourceLink": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemResourceLinkMargin",
        "cssStyleElementMinistryBrandsMetaItemResourceLinkPadding"
      ]
    },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info .brz-groupSlider_meta:hover":
      {
        standart: [
          "cssStyleElementMinistryGroupSliderMetaTypography",
          "cssStyleElementOfMinistryBrandsMetaColor"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-groupSlider-info .brz-groupSlider_meta--link": {
      standart: ["cssStyleElementMinistryGroupSliderMetaTypography"]
    },
    ".brz && .brz-groupSlider-info .brz-groupSlider_meta--link > .brz-ministryBrands__meta--icons:hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-groupSlider-info .brz-groupSlider_meta--link a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info": {
      standart: ["cssStyleElementMinistryGroupSliderMetaSpacing"]
    },
    ".brz && .brz-groupSlider-swiper-slide .brz-groupSlider-info p:hover": {
      standart: [
        "cssStyleElementMinistryGroupSliderMetaTypography",
        "cssStyleElementOfMinistryBrandsMetaColor"
      ],
      interval: ["cssStyleHoverTransition"]
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
          "cssStyleElementMinistryBrandsButtonsBorderRadius",
          "cssStyleElementMinistryGroupSliderButtonBoxShadow"
        ],
        interval: ["cssStyleMinistryBrandsButtonsHoverTransition"]
      }
  };

  return renderStyles({ ...data, styles });
}
