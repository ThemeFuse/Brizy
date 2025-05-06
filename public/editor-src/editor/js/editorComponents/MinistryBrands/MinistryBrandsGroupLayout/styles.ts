import { isStory } from "visual/providers/EditorModeProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const { v, contexts } = data;
  const { maskShape = "none" } = v;
  const _isStory = isStory(contexts.mode);

  const styles: Styles = {
    ".brz && .brz-groupLayout": {
      standart: ["cssStylePaddingBG", "cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-groupLayout": {
      standart: [
        "cssStylementOfMinistryBrandsParentBgColor",
        "cssStylementOfMinistryBrandsParentBgGradient",
        "cssStylementOfMinistryBrandsParentBorder",
        "cssStylementOfMinistryBrandsParentBoxShadow"
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
      ]
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
      standart: ["cssStyleElementOfMinistryBrandsImgFilters"]
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
    ".brz && .brz-groupLayout__content": {
      standart: ["cssStyleElementOfMinistryBrandsColumnsNumberWithSpacing"]
    },
    ".brz && .brz-ministryBrands__meta--icons": {
      standart: ["cssStyleElementOfMinistryBrandsMetaIconsSpacing"]
    },
    ".brz && .brz-groupLayout--item__content-meta a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsMetaLinksColor"]
    },
    ".brz && .brz-groupLayout--item__content": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsMetaItemsSpacing"
      ]
    },
    ".brz && .brz-groupLayout__filters:hover": {
      standart: [
        "cssStyleMinistryElementFiltersBgColor",
        "cssStyleMinistryElementFiltersBgGradient"
      ]
    },
    ".brz && .brz-groupLayout__filters .brz-groupLayout__filters--form-selectWrapper":
      {
        standart: [
          "cssStyleMinistryElementFiltersTypography",
          "cssStyleMinistryElementFiltersBorderRadius"
        ]
      },
    ".brz && .brz-groupLayout__filters .brz-groupLayout__filters--form-selectWrapper:hover":
      {
        standart: [
          "cssStyleMinistryElementFiltersBorder",
          "cssStyleMinistryElementFiltersInputBgColor",
          "cssStyleMinistryElementFiltersInputGradientColor",
          "cssStyleMinistryElementFiltersInputColor"
        ]
      },
    ".brz && .brz-groupLayout__filters .brz-groupLayout__filters--form-selectWrapper:hover select option":
      {
        standart: [
          "cssStyleMinistryElementFiltersInputBgColor",
          "cssStyleMinistryElementFiltersInputGradientColor"
        ]
      },
    ".brz && .brz-groupLayout__filters input": {
      standart: ["cssStyleMinistryElementFiltersTypography"]
    },
    ".brz && .brz-groupLayout__filters input:hover": {
      standart: ["cssStyleMinistryElementFiltersInputColor"]
    },
    ".brz && .brz-groupLayout__filters fieldset": {
      standart: ["cssStyleMinistryElementFiltersBorderRadius"]
    },
    ".brz && .brz-groupLayout__filters fieldset:hover": {
      standart: [
        "cssStyleMinistryElementFiltersBorder",
        "cssStyleMinistryElementFiltersInputBgColor",
        "cssStyleMinistryElementFiltersInputGradientColor"
      ]
    },
    ".brz && .brz-groupLayout__filters fieldset:hover input::placeholder": {
      standart: ["cssStyleMinistryElementFiltersInputColor"]
    },
    ".brz && .brz-groupLayout__filters fieldset:hover button": {
      standart: ["cssStyleMinistryElementFiltersInputColor"]
    },
    ".brz && .brz-groupLayout--item__content-heading": {
      standart: ["cssStyleElementOfMinistryBrandsTitleTypography"]
    },
    ".brz && .brz-groupLayout--item__content-heading:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"]
    },
    ".brz && .brz-groupLayout--item__content-heading a": {
      standart: ["cssStyleElementOfMinistryBrandsTitleTypography"]
    },
    ".brz && .brz-groupLayout--item__content-heading a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"]
    },
    ".brz && .brz-groupLayout--item__content-meta": {
      standart: ["getAllCssStyleTypography"]
    },
    ".brz && .brz-groupLayout--item__content-meta:hover": {
      standart: ["cssStyleColor"]
    },
    ".brz && .brz-groupLayout--item__content-preview": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewTypography"]
    },
    ".brz && .brz-groupLayout--item__content-preview:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewColor"]
    },
    ".brz && .brz-groupLayout--item__content-preview--more": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewTypography"]
    },
    ".brz && .brz-groupLayout--item__content-preview--more:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewColor"]
    },
    ".brz && .brz-groupLayout__pagination a:not(#current)": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationTypography"]
    },
    ".brz && .brz-groupLayout__pagination a:hover:not(#current)": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationColor"]
    },
    ".brz && .brz-groupLayout__pagination a#current": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationTypography",
        "cssStyleElementOfMinistryBrandsPaginationColorActive"
      ]
    },
    ".brz && .brz-groupLayout--item__content-detailButton": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsTypography",
        "cssStyleElementMinistryBrandsButtonsBorderRadius"
      ]
    },
    ".brz && .brz-groupLayout--item__content-detailButton:hover": {
      standart: [
        "cssStyleElementMinistryBrandsButtonsBgColor",
        "cssStyleElementMinistryBrandsButtonsBgGradient",
        "cssStyleElementMinistryBrandsButtonsColor",
        "cssStyleElementMinistryBrandsButtonsBoxShadow",
        "cssStyleElementMinistryBrandsButtonsBorder"
      ],
      interval: ["cssStyleMinistryBrandsButtonsHoverTransition"]
    },
    ".brz && .brz-groupLayout--item__content-detailButton a": {
      standart: [
        ...(_isStory
          ? ["cssStyleElementButtonSizeForStory"]
          : ["cssStyleElementMinistryBrandsButtonsSize"])
      ]
    },
    ".brz && .brz-groupLayout-results-heading": {
      standart: [
        "cssStyleElementMinistryResultsHeadingTypography",
        "cssStyleElementMinistryResultsHeadingColor"
      ]
    },
    ".brz && .brz-groupLayout-no-results": {
      standart: [
        "cssStyleElementMinistryNoResultsParagraphTypography",
        "cssStyleElementMinistryNoResultsParagraphColor"
      ]
    },
    ".brz && .brz-groupLayout, .brz && .brz-ministryBrands__item--media, .brz && .brz-ministryBrands__item--media::after, .brz && .brz-ministryBrands__item--media :is(img, video, iframe), .brz && .brz-groupLayout--item__content-meta a, .brz && .brz-groupLayout__filters, .brz && .brz-groupLayout__filters .brz-groupLayout__filters--form-selectWrapper, .brz && .brz-groupLayout__filters .brz-groupLayout__filters--form-selectWrapper select option, .brz && .brz-groupLayout__filters input, .brz && .brz-groupLayout__filters fieldset, .brz && .brz-groupLayout__filters fieldset input::placeholder, .brz && .brz-groupLayout__filters fieldset button, .brz && .brz-groupLayout--item__content-heading, .brz && .brz-groupLayout--item__content-heading a, .brz && .brz-groupLayout--item__content-meta, .brz && .brz-groupLayout--item__content-preview, .brz && .brz-groupLayout--item__content-preview--more, .brz && .brz-groupLayout__pagination a:not(#current), .brz && .brz-groupLayout-results-heading, .brz && .brz-groupLayout-no-results":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
