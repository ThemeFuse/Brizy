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
    ".brz &&:hover .brz-sermonFeatured": {
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
    ".brz && .brz-ministryBrands__item--media:hover :is(img,iframe,video)": {
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
    ".brz && .brz-sermonFeatured__item--meta:hover": {
      standart: ["cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta-title": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemTitleMargin",
        "cssStyleElementMinistryBrandsMetaItemTitlePadding"
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
    ".brz && .brz-ministryBrands__item--meta-preacher": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemPreacherMargin",
        "cssStyleElementMinistryBrandsMetaItemPreacherPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-passage": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemPassageMargin",
        "cssStyleElementMinistryBrandsMetaItemPassagePadding"
      ]
    },
    ".brz && :is(.brz-sermonFeatured__item--meta, .brz-sermonFeatured__item--meta-passage)":
      {
        standart: ["getAllCssStyleTypography"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonFeatured__item--meta-passage >.brz-ministryBrands__meta--icons:hover":
      {
        standart: ["cssStyleColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-sermonFeatured__item--meta--title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-sermonFeatured__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsSpacing"
      ]
    },
    ".brz && .brz-sermonFeatured__item--meta--preview:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPreviewTypography",
        "cssStyleElementOfMinistryBrandsPreviewColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && :is(.brz-sermonFeatured__item--meta-passage a,  .brz-ministryBrands__item--meta-passage-content):hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonFeatured__item--media--links a:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsMediaTypography",
        "cssStyleElementOfMinistryBrandsMetaLinksColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta--button:hover": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsTypography",
        "cssStyleElementMinistryBrandsButtonsBgColor",
        "cssStyleElementMinistryBrandsButtonsBgGradient",
        "cssStyleElementMinistryBrandsButtonsColor",
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
