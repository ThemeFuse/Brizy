import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v } = data;
  const { maskShape = "none" } = v;

  const styles: Styles = {
    ".brz &&:hover .brz-staffList": {
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
    ".brz && .brz-staffList__item, .brz && article": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsMetaItemsSpacing"
      ]
    },
    ".brz &&:hover .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
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
    ".brz &&:hover .brz-staffList__container": {
      standart: [
        "cssStyleElementOfMinistryBrandsColumnsNumberWithSpacing",
        "cssStyleElementOfMinistryBrandsContainerHorizontalAlign"
      ]
    },
    ".brz && .brz-staffList__item--meta": {
      standart: ["getAllCssStyleTypography"]
    },
    ".brz && .brz-staffList__item--meta:hover": {
      standart: ["cssStyleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-staffList__detail-url .brz-staffList__detail_page--button-text:hover":
      {
        standart: [
          "cssStyleElementOfMinistryBrandsSocialDescriptionTypography",
          "cssStyleElementOfMinistryBrandsSocialDescriptionColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-staffList__heading:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography",
        "cssStyleElementMinistryBrandsMetaItemTitleMargin",
        "cssStyleElementMinistryBrandsMetaItemTitlePadding"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-staffList__position": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemCategoryMargin",
        "cssStyleElementMinistryBrandsMetaItemCategoryPadding"
      ],
      interval: ["cssStyleHoverTransition"]
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
    ".brz && .brz-ministryBrands__item--meta-full-email .brz-staffList__link--full-email:hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaFullEmailColor"],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-ministryBrands__item--meta-full-email": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemEmailMargin",
        "cssStyleElementMinistryBrandsMetaItemEmailPadding",
        "cssStyleElementOfMinistryBrandsMetaFullEmailTypography"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-group": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemGroupMargin",
        "cssStyleElementMinistryBrandsMetaItemGroupPadding"
      ]
    },
    ".brz && .brz-staffList__link:not(.brz-staffList__link--full-email):hover":
      {
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
    ".brz && .brz-staffList__pagination a:hover:not(#current)": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationColor",
        "cssStyleElementOfMinistryBrandsPaginationTypography"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffList__pagination a#current": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationTypography",
        "cssStyleElementOfMinistryBrandsPaginationColorActive"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
