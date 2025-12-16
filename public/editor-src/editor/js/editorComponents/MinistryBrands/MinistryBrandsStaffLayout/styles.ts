import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v } = data;
  const { maskShape = "none" } = v;

  const styles: Styles = {
    ".brz &&:hover .brz-staffLayout": {
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
    ".brz && .brz-staffLayout__content": {
      standart: ["cssStyleElementOfMinistryBrandsColumnsNumberWithSpacing"]
    },
    ".brz && .brz-staffLayout__content > article": {
      standart: ["cssStyleElementOfMinistryBrandsHorizontalAlign"]
    },
    ".brz && .brz-staffLayout__content :is(article, .brz-staffLayout__item)": {
      standart: ["cssStyleElementOfMinistryBrandsMetaItemsSpacing"]
    },
    ".brz &&:hover .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && .brz-staffLayout__filters:hover": {
      standart: [
        "cssStyleMinistryElementFiltersBgColor",
        "cssStyleMinistryElementFiltersBgGradient"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffLayout_meta:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaTextColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffLayout_meta": {
      standart: ["cssStyleElementOfMinistryBrandsMetaTextTypography"]
    },
    ".brz && .brz-staffLayout_rollover_inner--description:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsSocialDescriptionTypography",
        "cssStyleElementOfMinistryBrandsSocialDescriptionColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsMetaTitleTypography",
        "cssStyleElementOfMinistryBrandsMetaTitleColor",
        "cssStyleElementMinistryBrandsMetaItemTitleMargin",
        "cssStyleElementMinistryBrandsMetaItemTitlePadding"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-position:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsMetaPositionTypography",
        "cssStyleElementOfMinistryBrandsMetaPositionColor",
        "cssStyleElementMinistryBrandsMetaItemPositionMargin",
        "cssStyleElementMinistryBrandsMetaItemPositionPadding"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffLayout-results-heading": {
      standart: [
        "cssStyleElementMinistryResultsHeadingTypography",
        "cssStyleElementMinistryResultsHeadingColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-staffLayout-no-results": {
      standart: [
        "cssStyleElementMinistryNoResultsParagraphTypography",
        "cssStyleElementMinistryNoResultsParagraphColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__item--meta-groups": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemGroupMargin",
        "cssStyleElementMinistryBrandsMetaItemGroupPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-cellphone": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemCellphoneMargin",
        "cssStyleElementMinistryBrandsMetaItemCellphonePadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-workphone": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemWorkphoneMargin",
        "cssStyleElementMinistryBrandsMetaItemWorkphonePadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-full-email": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemEmailMargin",
        "cssStyleElementMinistryBrandsMetaItemEmailPadding",
        "cssStyleElementOfMinistryBrandsMetaFullEmailTypography"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-full-email .brz-staffLayout__link--full-email:hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaFullEmailColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-ministryBrands__item--media:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsImageWidth",
        "cssStyleElementOfMinistryBrandsImgBorder",
        "cssStyleMinistryElementMediaBorderRadius",
        "cssStyleElementOfMinistryBrandsImageAspectRatio",
        ...(maskShape === "none"
          ? ["cssStyleElementOfMinistryBrandsImgBoxShadow"]
          : ["cssStyleElementOfMinistryBrandsImgMaskShadow"])
      ],
      interval: ["cssStyleHoverTransition", "cssStylePropertyHoverTransition"]
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
    ".brz && .brz-staffLayout_social > li > a:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsSocialColor",
        "cssStyleElementOfMinistryBrandsSocialBgColor",
        "cssStyleElementOfMinistryBrandsSocialBgGradient",
        "cssStyleElementOfMinistryBrandsSocialBoxShadow",
        "cssStyleElementOfMinistryBrandsSocialBorder"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffLayout__filters .brz-staffLayout__filters--form-selectWrapper:hover":
      {
        standart: [
          "cssStyleMinistryElementFiltersTypography",
          "cssStyleMinistryElementFiltersBorder",
          "cssStyleMinistryElementFiltersBorderRadius",
          "cssStyleMinistryElementFiltersInputBgColor",
          "cssStyleMinistryElementFiltersInputGradientColor",
          "cssStyleMinistryElementFiltersInputColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-staffLayout__filters .brz-staffLayout__filters--form-selectWrapper:hover select option":
      {
        standart: [
          "cssStyleMinistryElementFiltersInputBgColor",
          "cssStyleMinistryElementFiltersInputGradientColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-staffLayout__filters input:hover": {
      standart: [
        "cssStyleMinistryElementFiltersTypography",
        "cssStyleMinistryElementFiltersInputColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffLayout__filters fieldset:hover": {
      standart: [
        "cssStyleMinistryElementFiltersBorder",
        "cssStyleMinistryElementFiltersBorderRadius",
        "cssStyleMinistryElementFiltersInputBgColor",
        "cssStyleMinistryElementFiltersInputGradientColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffLayout__filters fieldset:hover input::placeholder": {
      standart: ["cssStyleMinistryElementFiltersInputColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffLayout__filters fieldset:hover button": {
      standart: ["cssStyleMinistryElementFiltersInputColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffLayout__pagination a:hover:not(#current)": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationColor",
        "cssStyleElementOfMinistryBrandsPaginationTypography"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffLayout__pagination a#current": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationTypography",
        "cssStyleElementOfMinistryBrandsPaginationColorActive"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
