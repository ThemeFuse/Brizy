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
    ".brz &&:hover .brz-groupDetail": {
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
    ".brz &&:hover .brz-groupDetail__container": {
      standart: ["cssStyleElementOfMinistryBrandsColumnsNumber"]
    },
    ".brz &&:hover .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && .brz-groupDetail__item--meta--title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupDetail__item--meta--date:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsDateColor",
        "cssStyleElementOfMinistryBrandsDateTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-groupDetail__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsSpacing"
      ]
    },
    ".brz && .brz-groupDetail__item--meta:hover": {
      standart: ["getAllCssStyleTypography", "cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__pagination a:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationColor",
        "cssStyleElementOfMinistryBrandsPaginationTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--links:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsMetaLinksTypography",
        "cssStyleElementOfMinistryBrandsMetaLinksColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-groupDetail__item a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-groupDetail__item--meta--preview p:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsParagraphTypography",
        "cssStyleElementOfMinistryBrandsParagraphColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupDetail__item--meta--preview h4:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsH4Typography",
        "cssStyleElementOfMinistryBrandsH4Color"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-groupDetail__item--meta--preview ul": {
      standart: [
        "cssStyleElementOfMinistryBrandsListPaddingLeft",
        "cssStyleElementOfMinistryBrandsListTypes"
      ]
    },
    ".brz && .brz-groupDetail__item--meta--preview ul:hover li": {
      standart: [
        "cssStyleElementOfMinistryBrandsListTypography",
        "cssStyleElementOfMinistryBrandsListColor"
      ],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ ...data, styles });
}
