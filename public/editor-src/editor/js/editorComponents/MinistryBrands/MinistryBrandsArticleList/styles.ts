import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v } = data;
  const { maskShape = "none" } = v;

  const styles: Styles = {
    ".brz && .brz-articleList": {
      standart: ["cssStylePaddingBG", "cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-articleList": {
      standart: [
        "cssStylementOfMinistryBrandsParentBgColor",
        "cssStylementOfMinistryBrandsParentBgGradient",
        "cssStylementOfMinistryBrandsParentBorder",
        "cssStylementOfMinistryBrandsParentBoxShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-articleList__container": {
      standart: [
        "cssStyleElementOfMinistryBrandsColumnsNumberWithSpacing",
        "cssStyleElementOfMinistryBrandsContainerHorizontalAlign"
      ]
    },
    ".brz && .brz-articleList__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsMetaItemsSpacing"
      ]
    },
    ".brz && .brz-ministryBrands__item--media": {
      standart: [
        "cssStyleElementOfMinistryBrandsImageWidth",
        "cssStyleElementOfMinistryBrandsImagePadding",
        "cssStyleMinistryElementMediaBorderRadius"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsImgBorder",
        ...(maskShape === "none"
          ? ["cssStyleElementOfMinistryBrandsImgBoxShadow"]
          : ["cssStyleElementOfMinistryBrandsImgMaskShadow"])
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--media::after": {
      standart: [
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover::after": {
      standart: [
        "cssStyleElementOfMinistryBrandsImgBgColor",
        "cssStyleElementOfMinistryBrandsImgBgGradient"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--media :is(img, video, iframe)": {
      standart: [
        "cssStyleMaskShape",
        "cssStyleMaskCustomShape",
        "cssStyleMaskSize",
        "cssStyleMaskPosition",
        "cssStyleMaskRepeat"
      ]
    },
    ".brz && .brz-ministryBrands__item--media:hover :is(img, video, iframe)": {
      standart: ["cssStyleElementOfMinistryBrandsImgFilters"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-articleList__item--meta": {
      standart: ["getAllCssStyleTypography"]
    },
    ".brz && .brz-articleList__item--meta:hover": {
      standart: ["cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-articleList__item--meta.brz-ministryBrands__item--meta-title":
      {
        standart: [
          "cssStyleElementOfMinistryBrandsTitleTypography",
          "cssStyleElementMinistryBrandsMetaItemTitleMargin",
          "cssStyleElementMinistryBrandsMetaItemTitlePadding"
        ]
      },
    ".brz && .brz-articleList__item--meta.brz-ministryBrands__item--meta-title:hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsTitleColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-ministryBrands__item--meta-date": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemDateMargin",
        "cssStyleElementMinistryBrandsMetaItemDatePadding"
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
    ".brz && .brz-ministryBrands__item--meta-series": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemSeriesMargin",
        "cssStyleElementMinistryBrandsMetaItemSeriesPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-author": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemAuthorMargin",
        "cssStyleElementMinistryBrandsMetaItemAuthorPadding"
      ]
    },

    ".brz && .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && .brz-articleList__item--media a": {
      standart: ["cssStyleElementOfMinistryBrandsMediaTypography"]
    },
    ".brz && .brz-articleList__item--media a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-articleList__item--meta--preview": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewTypography"]
    },
    ".brz && .brz-articleList__item--meta--preview:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--button": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsTypography",
        "cssStyleElementMinistryBrandsButtonsBorderRadius"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta--button:hover": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsBgColor",
        "cssStyleElementMinistryBrandsButtonsBgGradient",
        "cssStyleElementMinistryBrandsButtonsColor",
        "cssStyleElementMinistryBrandsButtonsBoxShadow",
        "cssStyleElementMinistryBrandsButtonsBorder"
      ],
      interval: ["cssStyleMinistryBrandsButtonsHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--button a": {
      standart: ["cssStyleElementMinistryBrandsButtonsSize"]
    },
    ".brz && .brz-ministryBrands__pagination a": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationTypography"]
    },
    ".brz && .brz-ministryBrands__pagination a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__pagination a:not(#current)": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationTypography"]
    },
    ".brz && .brz-ministryBrands__pagination a:hover:not(#current)": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__pagination a#current": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationColorActive",
        "cssStyleElementOfMinistryBrandsPaginationTypography"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
