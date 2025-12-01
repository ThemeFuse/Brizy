import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v } = data;
  const { maskShape = "none" } = v;

  const styles: Styles = {
    ".brz && .brz-staffDetail": {
      standart: ["cssStylePaddingBG", "cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-staffDetail": {
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
    ".brz && .brz-staffDetail__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsSpacing"
      ]
    },
    ".brz && .brz-ministryBrands__item--media": {
      standart: [
        "cssStyleElementOfMinistryBrandsImageWidth",
        "cssStyleMinistryElementMediaBorderRadius",
        "cssStyleElementOfMinistryBrandsImageAspectRatio"
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
    ".brz && .brz-staffDetail__item--meta": {
      standart: ["getAllCssStyleTypography"]
    },
    ".brz && .brz-staffDetail__item--meta:hover": {
      standart: ["cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffDetail__item--meta.brz-ministryBrands__item--meta-title.brz-ministryBrands__item--meta-title:hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsTitleColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-staffDetail__item--meta.brz-ministryBrands__item--meta-title":
      {
        standart: [
          "cssStyleElementOfMinistryBrandsTitleTypography",
          "cssStyleElementMinistryBrandsMetaItemTitleMargin",
          "cssStyleElementMinistryBrandsMetaItemTitlePadding"
        ]
      },
    ".brz && .brz-ministryBrands__item--meta-position": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemPositionMargin",
        "cssStyleElementMinistryBrandsMetaItemPositionPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-groups": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemGroupMargin",
        "cssStyleElementMinistryBrandsMetaItemGroupPadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-workphone": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemWorkphoneMargin",
        "cssStyleElementMinistryBrandsMetaItemWorkphonePadding"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta-cellphone": {
      standart: [
        "cssStyleElementMinistryBrandsMetaItemCellphoneMargin",
        "cssStyleElementMinistryBrandsMetaItemCellphonePadding"
      ]
    },
    ".brz && .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && .brz-staffDetail__item--social a:hover": {
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
    ".brz && .brz-staffDetail__item--about": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewTypography"]
    },
    ".brz && .brz-staffDetail__item--about:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-ministryBrands__item--meta--links--previous": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksTypography"]
    },
    ".brz && .brz-ministryBrands__item--meta--links--previous:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-staffDetail__item--meta.brz-ministryBrands__item--meta-full-email":
      {
        standart: [
          "cssStyleElementMinistryBrandsMetaItemEmailMargin",
          "cssStyleElementMinistryBrandsMetaItemEmailPadding",
          "cssStyleElementOfMinistryBrandsMetaFullEmailTypography"
        ]
      },
    ".brz && .brz-staffDetail__item--meta.brz-ministryBrands__item--meta-full-email .brz-staffDetail__link--full-email:hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaFullEmailColor"],
        interval: ["cssStyleHoverTransition"]
      }
  };

  return renderStyles({ ...data, styles });
}
