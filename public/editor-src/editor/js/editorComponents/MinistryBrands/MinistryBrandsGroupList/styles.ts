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
    ".brz &&:hover .brz-groupList": {
      standart: [
        "cssStylePaddingBG",
        "cssStylementOfMinistryBrandsParentBgColor",
        "cssStylementOfMinistryBrandsParentBgGradient",
        "cssStylementOfMinistryBrandsParentBorder",
        "cssStylementOfMinistryBrandsParentBoxShadow",
        "cssStyleBorderRadius"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
    ".brz &&:hover .brz-groupList__container": {
      standart: [
        "cssStyleElementOfMinistryBrandsColumnsNumberWithSpacing",
        "cssStyleElementOfMinistryBrandsContainerHorizontalAlign"
      ]
    },
    ".brz &&:hover .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && .brz-groupList__item--meta--title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-groupList__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsMetaItemsSpacing"
      ]
    },
    ".brz && .brz-groupList__item--meta--preview *:not(a):hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPreviewTypography",
        "cssStyleElementOfMinistryBrandsPreviewColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupList__item--meta:hover": {
      standart: ["getAllCssStyleTypography", "cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupList__item--meta--link > .brz-ministryBrands__meta--icons:hover":
      {
        standart: ["cssStyleColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-groupList__item--meta--link > *": {
      standart: ["getAllCssStyleTypography"]
    },
    ".brz && .brz-ministryBrands__pagination a:hover:not(#current)": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationColor",
        "cssStyleElementOfMinistryBrandsPaginationTypography"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__pagination a#current": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationTypography",
        "cssStyleElementOfMinistryBrandsPaginationColorActive"
      ]
    },
    ".brz && .brz-groupList__item :not(.brz-groupList__item--meta--title, .brz-ministryBrands__item--meta--button) a:hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-ministryBrands__item--meta--button:hover": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsColor",
        "cssStyleElementMinistryBrandsButtonsTypography",
        "cssStyleElementMinistryBrandsButtonsBgColor",
        "cssStyleElementMinistryBrandsButtonsBgGradient",
        "cssStyleElementMinistryBrandsButtonsBoxShadow",
        "cssStyleElementMinistryBrandsButtonsBorder",
        "cssStyleElementMinistryBrandsButtonsBorderRadius"
      ],
      interval: ["cssStyleMinistryBrandsButtonsHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--button a": {
      standart: ["cssStyleElementMinistryBrandsButtonsSize"]
    }
  };

  return renderStyles({ ...data, styles });
}
