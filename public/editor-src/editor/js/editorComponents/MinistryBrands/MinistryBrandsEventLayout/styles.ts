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
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
        standart: ["cssStyleElementOfMinistryBrandsImgFilters"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyEventLayoutHoverTransition"
        ]
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
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && li.brz-eventLayout--view-active": {
      standart: [
        "cssStyleElementEventLayoutViewTypography",
        "cssStyleElementEventLayoutViewColorActive",
        "cssStyleElementEventLayoutViewBgColorActive",
        "cssStyleElementEventLayoutViewBgGradientActive",
        "cssStyleElementEventLayoutViewBorderActive"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--filters:hover": {
      standart: [
        "cssStyleMinistryElementFiltersBgColor",
        "cssStyleMinistryElementFiltersBgGradient"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-eventLayout--filters .brz-eventLayout--filters-form-selectWrapper:hover::after":
      {
        standart: ["cssStyleMinistryElementFiltersInputColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-eventLayout--filters .brz-eventLayout--filters-form-selectWrapper:hover select option":
      {
        standart: ["cssStyleMinistryElementFiltersInputBgColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-eventLayout--filters input": {
      standart: ["cssStyleMinistryElementFiltersTypography"]
    },
    ".brz && .brz-eventLayout--filters input:hover": {
      standart: ["cssStyleMinistryElementFiltersInputColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--filters fieldset ": {
      standart: ["cssStyleMinistryElementFiltersBorderRadius"]
    },
    ".brz && .brz-eventLayout--filters fieldset:hover ": {
      standart: [
        "cssStyleMinistryElementFiltersBorder",
        "cssStyleMinistryElementFiltersInputBgColor",
        "cssStyleMinistryElementFiltersInputGradientColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--filters fieldset:hover input::placeholder": {
      standart: ["cssStyleMinistryElementFiltersInputColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--filters fieldset:hover button": {
      standart: ["cssStyleMinistryElementFiltersInputColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--featured__item-title": {
      standart: ["cssStyleElementOfMinistryBrandsTitleTypography"]
    },
    ".brz && .brz-eventLayout--featured__item-title:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--featured__item-title a:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--featured__item p": {
      standart: ["cssStyleElementOfMinistryBrandsDateTypography"]
    },
    ".brz && .brz-eventLayout--featured__item p:hover": {
      standart: ["cssStyleElementOfMinistryBrandsDateColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--featured__preview > div > span": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewTypography"]
    },
    ".brz && .brz-eventLayout--featured__preview > div > span:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPreviewColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyEventLayoutHoverTransition"
      ]
    },
    ".brz && .brz-eventLayout__pagination span": {
      standart: [
        "cssStyleElementEventLayoutListPaginationTypography",
        "cssStyleElementEventLayoutListPaginationColor",
        "cssStyleElementEventLayoutListPaginationSpacing"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventLayout__pagination a:hover": {
      standart: ["cssStyleElementEventLayoutListPaginationArrowsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--list-item__title:hover": {
      standart: ["cssStyleElementEventLayoutListTitleBorderBottom"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--list-item__grouping-day": {
      standart: ["cssStyleElementEventLayoutGroupingDayTypography"]
    },
    ".brz && .brz-eventLayout--list-item__grouping-day:hover": {
      standart: ["cssStyleElementEventLayoutGroupingDayColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--list-item__grouping-date": {
      standart: ["cssStyleElementEventLayoutGroupingDateTypography"]
    },
    ".brz && .brz-eventLayout--list-item__grouping-date:hover": {
      standart: ["cssStyleElementEventLayoutGroupingDateColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--list-item__content-date": {
      standart: ["cssStyleElementEventLayoutListItemDateTypography"]
    },
    ".brz && .brz-eventLayout--list-item__content-date:hover": {
      standart: [
        "cssStyleElementEventLayoutListItemDateColor",
        "cssStyleElementEventLayoutListItemDateBackgroundColor",
        "cssStyleElementEventLayoutListItemDateBackgroundGradient"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--list-item__content__heading": {
      standart: ["cssStyleElementEventLayoutListItemTitleTypography"]
    },
    ".brz && .brz-eventLayout--list-item__content__heading:hover": {
      standart: ["cssStyleElementEventLayoutListItemTitleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--list-item__content__meta": {
      standart: ["cssStyleElementEventLayoutListItemMetaTypography"]
    },
    ".brz && .brz-eventLayout--list-item__content__meta:hover": {
      standart: ["cssStyleElementEventLayoutListItemMetaColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
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
      standart: ["cssStyleElementEventLayoutCalendarHeadingColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--calendar-day": {
      standart: ["cssStyleElementEventLayoutCalendarDaysTypography"]
    },
    ".brz && .brz-eventLayout--calendar-day:hover": {
      standart: ["cssStyleElementEventLayoutCalendarDaysBorder"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--calendar-day li span": {
      standart: ["cssStyleElementEventLayoutCalendarEventsTypography"]
    },
    ".brz && .brz-eventLayout--calendar-day li span:hover": {
      standart: ["cssStyleElementEventLayoutCalendarEventsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--calendar-day__number span:hover": {
      standart: [
        "cssStyleElementEventLayoutCalendarDaysBgColor",
        "cssStyleElementEventLayoutCalendarDaysBgGradient",
        "cssStyleElementEventLayoutCalendarDaysColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--calendar-day-np:hover": {
      standart: [
        "cssStyleElementEventLayoutCalendarDaysBgColor",
        "cssStyleElementEventLayoutCalendarDaysBgGradient",
        "cssStyleElementEventLayoutCalendarDaysBorder"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout-results-heading": {
      standart: [
        "cssStyleElementMinistryResultsHeadingTypography",
        "cssStyleElementMinistryResultsHeadingColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventLayout-no-results": {
      standart: [
        "cssStyleElementMinistryNoResultsParagraphTypography",
        "cssStyleElementMinistryNoResultsParagraphColor"
      ],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ ...data, styles });
}
