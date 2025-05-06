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
    ".brz && .brz-eventLayout--view ul": {
      standart: ["cssStyleElementEventLayoutTabAlign"]
    },
    ".brz && .brz-eventLayout": {
      standart: ["cssStylePaddingBG", "cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-eventLayout": {
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
    ".brz && :is(.brz-eventLayout--featured__preview, .brz-ministryBrands__item--media :is(iframe, video,img))":
      {
        standart: [
          "cssStyleMaskShape",
          "cssStyleMaskCustomShape",
          "cssStyleMaskSize",
          "cssStyleMaskPosition",
          "cssStyleMaskRepeat"
        ]
      },
    ".brz && :is(.brz-eventLayout--featured__preview, .brz-ministryBrands__item--media:hover :is(iframe, video,img))":
      {
        standart: ["cssStyleElementOfMinistryBrandsImgFilters"]
      },
    ".brz && .brz-eventLayout--featured": {
      standart: ["cssStyleElementOfMinistryBrandsColumnsNumberWithSpacing"]
    },
    ".brz && .brz-eventLayout--featured__preview": {
      standart: ["cssStyleElementOfMinistryBrandsFeaturedPreviewPadding"]
    },
    ".brz && .brz-eventLayout--featured__item": {
      standart: [
        "cssStyleElementOfMinistryBrandsHorizontalAlign",
        "cssStyleElementOfMinistryBrandsMetaItemsSpacing"
      ]
    },
    ".brz && .brz-eventLayout--featured__item-content": {
      standart: ["cssStyleElementOfMinistryBrandsHorizontalAlign"]
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
    ".brz && .brz-eventLayout--view li:not(.brz-eventLayout--view-active)": {
      standart: ["cssStyleElementEventLayoutViewTypography"]
    },
    ".brz && .brz-eventLayout--view li:hover:not(.brz-eventLayout--view-active)":
      {
        standart: [
          "cssStyleElementEventLayoutViewBgColor",
          "cssStyleElementEventLayoutViewBgGradient",
          "cssStyleElementEventLayoutViewColor",
          "cssStyleElementEventLayoutViewBorder"
        ]
      },
    ".brz && li.brz-eventLayout--view-active": {
      standart: [
        "cssStyleElementEventLayoutViewTypography",
        "cssStyleElementEventLayoutViewColorActive",
        "cssStyleElementEventLayoutViewBgColorActive",
        "cssStyleElementEventLayoutViewBgGradientActive",
        "cssStyleElementEventLayoutViewBorderActive"
      ]
    },
    ".brz && .brz-eventLayout--filters:hover": {
      standart: [
        "cssStyleMinistryElementFiltersBgColor",
        "cssStyleMinistryElementFiltersBgGradient"
      ]
    },
    ".brz && .brz-eventLayout--filters .brz-eventLayout--filters-form-selectWrapper":
      {
        standart: [
          "cssStyleMinistryElementFiltersTypography",
          "cssStyleMinistryElementFiltersBorderRadius"
        ]
      },
    ".brz && .brz-eventLayout--filters .brz-eventLayout--filters-form-selectWrapper:hover":
      {
        standart: [
          "cssStyleMinistryElementFiltersBorder",
          "cssStyleMinistryElementFiltersInputBgColor",
          "cssStyleMinistryElementFiltersInputGradientColor",
          "cssStyleMinistryElementFiltersInputColor"
        ]
      },
    ".brz && .brz-eventLayout--filters .brz-eventLayout--filters-form-selectWrapper:hover::after":
      {
        standart: ["cssStyleMinistryElementFiltersInputColor"]
      },
    ".brz && .brz-eventLayout--filters .brz-eventLayout--filters-form-selectWrapper:hover select option":
      {
        standart: ["cssStyleMinistryElementFiltersInputBgColor"]
      },
    ".brz && .brz-eventLayout--filters input": {
      standart: ["cssStyleMinistryElementFiltersTypography"]
    },
    ".brz && .brz-eventLayout--filters input:hover": {
      standart: ["cssStyleMinistryElementFiltersInputColor"]
    },
    ".brz && .brz-eventLayout--filters fieldset ": {
      standart: ["cssStyleMinistryElementFiltersBorderRadius"]
    },
    ".brz && .brz-eventLayout--filters fieldset:hover": {
      standart: [
        "cssStyleMinistryElementFiltersBorder",
        "cssStyleMinistryElementFiltersInputBgColor",
        "cssStyleMinistryElementFiltersInputGradientColor"
      ]
    },
    ".brz && .brz-eventLayout--filters fieldset:hover input::placeholder": {
      standart: ["cssStyleMinistryElementFiltersInputColor"]
    },
    ".brz && .brz-eventLayout--filters fieldset:hover button": {
      standart: ["cssStyleMinistryElementFiltersInputColor"]
    },
    ".brz && .brz-eventLayout--featured__item-title": {
      standart: ["cssStyleElementOfMinistryBrandsTitleTypography"]
    },
    ".brz && .brz-eventLayout--featured__item-title:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"]
    },
    ".brz && .brz-eventLayout--featured__item-title a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"]
    },
    ".brz && .brz-eventLayout--featured__item p": {
      standart: ["cssStyleElementOfMinistryBrandsDateTypography"]
    },
    ".brz && .brz-eventLayout--featured__item p:hover": {
      standart: ["cssStyleElementOfMinistryBrandsDateColor"]
    },
    ".brz && .brz-eventLayout--featured__preview > div > span": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewTypography"]
    },
    ".brz && .brz-eventLayout--featured__preview > div > span:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewColor"]
    },
    ".brz && .brz-eventLayout__pagination span": {
      standart: [
        "cssStyleElementEventLayoutListPaginationTypography",
        "cssStyleElementEventLayoutListPaginationColor",
        "cssStyleElementEventLayoutListPaginationSpacing"
      ]
    },
    ".brz && .brz-eventLayout__pagination a:hover": {
      standart: ["cssStyleElementEventLayoutListPaginationArrowsColor"]
    },
    ".brz && .brz-eventLayout--list-item__title:hover": {
      standart: ["cssStyleElementEventLayoutListTitleBorderBottom"]
    },
    ".brz && .brz-eventLayout--list-item__grouping-day": {
      standart: ["cssStyleElementEventLayoutGroupingDayTypography"]
    },
    ".brz && .brz-eventLayout--list-item__grouping-day:hover": {
      standart: ["cssStyleElementEventLayoutGroupingDayColor"]
    },
    ".brz && .brz-eventLayout--list-item__grouping-date": {
      standart: ["cssStyleElementEventLayoutGroupingDateTypography"]
    },
    ".brz && .brz-eventLayout--list-item__grouping-date:hover": {
      standart: ["cssStyleElementEventLayoutGroupingDateColor"]
    },
    ".brz && .brz-eventLayout--list-item__content-date": {
      standart: ["cssStyleElementEventLayoutListItemDateTypography"]
    },
    ".brz && .brz-eventLayout--list-item__content-date:hover": {
      standart: [
        "cssStyleElementEventLayoutListItemDateColor",
        "cssStyleElementEventLayoutListItemDateBackgroundColor",
        "cssStyleElementEventLayoutListItemDateBackgroundGradient"
      ]
    },
    ".brz && .brz-eventLayout--list-item__content__heading": {
      standart: ["cssStyleElementEventLayoutListItemTitleTypography"]
    },
    ".brz && .brz-eventLayout--list-item__content__heading:hover": {
      standart: ["cssStyleElementEventLayoutListItemTitleColor"]
    },
    ".brz && .brz-eventLayout--list-item__content__meta": {
      standart: ["cssStyleElementEventLayoutListItemMetaTypography"]
    },
    ".brz && .brz-eventLayout--list-item__content__meta:hover": {
      standart: ["cssStyleElementEventLayoutListItemMetaColor"]
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
    ".brz && .brz-eventLayout--calendar-heading": {
      standart: ["cssStyleElementEventLayoutCalendarHeadingTypography"]
    },
    ".brz && .brz-eventLayout--calendar-heading:hover": {
      standart: ["cssStyleElementEventLayoutCalendarHeadingColor"]
    },
    ".brz && .brz-eventLayout--calendar-day": {
      standart: ["cssStyleElementEventLayoutCalendarDaysTypography"]
    },
    ".brz && .brz-eventLayout--calendar-day:hover": {
      standart: ["cssStyleElementEventLayoutCalendarDaysBorder"]
    },
    ".brz && .brz-eventLayout--calendar-day li span": {
      standart: ["cssStyleElementEventLayoutCalendarEventsTypography"]
    },
    ".brz && .brz-eventLayout--calendar-day li span:hover": {
      standart: ["cssStyleElementEventLayoutCalendarEventsColor"]
    },
    ".brz && .brz-eventLayout--calendar-day__number span:hover": {
      standart: [
        "cssStyleElementEventLayoutCalendarDaysBgColor",
        "cssStyleElementEventLayoutCalendarDaysBgGradient",
        "cssStyleElementEventLayoutCalendarDaysColor"
      ]
    },
    ".brz && .brz-eventLayout--calendar-day-np:hover": {
      standart: [
        "cssStyleElementEventLayoutCalendarDaysBgColor",
        "cssStyleElementEventLayoutCalendarDaysBgGradient",
        "cssStyleElementEventLayoutCalendarDaysBorder"
      ]
    },
    ".brz && .brz-eventLayout-results-heading": {
      standart: [
        "cssStyleElementMinistryResultsHeadingTypography",
        "cssStyleElementMinistryResultsHeadingColor"
      ]
    },
    ".brz && .brz-eventLayout-no-results": {
      standart: [
        "cssStyleElementMinistryNoResultsParagraphTypography",
        "cssStyleElementMinistryNoResultsParagraphColor"
      ]
    },
    ".brz && .brz-eventLayout, .brz && .brz-ministryBrands__item--media, .brz && .brz-ministryBrands__item--media::after, .brz && :is(.brz-eventLayout--featured__preview, .brz-ministryBrands__item--media :is(iframe, video,img)), .brz && .brz-eventLayout--view li:not(.brz-eventLayout--view-active), .brz && .brz-eventLayout--filters, .brz && .brz-eventLayout--filters .brz-eventLayout--filters-form-selectWrapper, .brz && .brz-eventLayout--filters .brz-eventLayout--filters-form-selectWrapper::after, .brz && .brz-eventLayout--filters .brz-eventLayout--filters-form-selectWrapper select option, .brz && .brz-eventLayout--filters input, .brz && .brz-eventLayout--filters fieldset, .brz && .brz-eventLayout--filters fieldset input::placeholder, .brz && .brz-eventLayout--filters fieldset button, .brz && .brz-eventLayout--featured__item-title, .brz && .brz-eventLayout--featured__item-title a, .brz && .brz-eventLayout--featured__item p, .brz && .brz-eventLayout--featured__preview > div > span, .brz && .brz-eventLayout__pagination span, .brz && .brz-eventLayout__pagination a, .brz && .brz-eventLayout--list-item__title, .brz && .brz-eventLayout--list-item__grouping-day, .brz && .brz-eventLayout--list-item__grouping-date, .brz && .brz-eventLayout--list-item__content-date, .brz && .brz-eventLayout--list-item__content__heading, .brz && .brz-eventLayout--list-item__content__meta, .brz && .brz-eventLayout--calendar-heading, .brz && .brz-eventLayout--calendar-day, .brz && .brz-eventLayout--calendar-day li span, .brz && .brz-eventLayout--calendar-day__number span, .brz && .brz-eventLayout--calendar-day-np, .brz && .brz-eventLayout-results-heading, .brz && .brz-eventLayout-no-results":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
