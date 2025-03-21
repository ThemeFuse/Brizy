import { isStory } from "visual/providers/EditorModeProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v, contexts } = data;

  const { maskShape = "none" } = v;

  const _isStory = isStory(contexts.mode);

  const styles: Styles = {
    ".brz && .brz-sermonList": {
      standart: ["cssStylePaddingBG", "cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-sermonList": {
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
    ".brz && .brz-sermonList__container": {
      standart: [
        "cssStyleElementOfMinistryBrandsColumnsNumberWithSpacing",
        "cssStyleElementOfMinistryBrandsContainerHorizontalAlign"
      ]
    },
    ".brz && .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && .brz-sermonList__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsMetaItemsSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && :is(.brz-sermonList__item--meta, .brz-sermonList__item--meta--link)":
      {
        standart: ["getAllCssStyleTypography"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonList__item--meta:not(a):hover": {
      standart: ["cssStyleColor"],
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
    },
    ".brz && .brz-sermonList__item--meta--title": {
      standart: ["cssStyleElementOfMinistryBrandsTitleTypography"]
    },
    ".brz && .brz-sermonList__item--meta--title:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-sermonList__item--meta--preview": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewTypography"]
    },
    ".brz && .brz-sermonList__item--meta--preview:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-ministryBrands__pagination a": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationTypography"]
    },
    ".brz && .brz-ministryBrands__pagination a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationColor"],
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
      standart: [
        ...(_isStory
          ? ["cssStyleElementButtonSizeForStory"]
          : ["cssStyleElementMinistryBrandsButtonsSize"])
      ]
    },
    ".brz && .brz-sermonList__item--media a": {
      standart: ["cssStyleElementOfMinistryBrandsMediaTypography"]
    },
    ".brz && .brz-sermonList__item--media a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && :is(.brz-sermonList__item--meta--link a, .brz-ministryBrands__item--meta-passage-content):hover":
      {
        standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-sermonList__item--meta--link > .brz-ministryBrands__meta--icons:hover":
      {
        standart: ["cssStyleColor"],
        interval: ["cssStyleHoverTransition"]
      }
  };

  return renderStyles({ ...data, styles });
}
