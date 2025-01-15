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
    ".brz &&:hover .brz-eventLayout--view ul": {
      standart: ["cssStyleElementEventLayoutTabAlign"]
    },
    ".brz &&:hover .brz-eventLayout": {
      standart: [
        "cssStylePaddingBG",
        "cssStyleBorderRadius",
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
    ".brz && :is(.brz-eventLayout--featured__preview, .brz-ministryBrands__item--media:hover :is(iframe, video,img))":
      {
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
    ".brz && .brz-eventLayout--view li:hover:not(.brz-eventLayout--view-active)":
      {
        standart: [
          "cssStyleElementEventLayoutViewTypography",
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
    ".brz && li.brz-eventLayout--view-active:hover": {
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

    ".brz && .brz-eventLayout--filters .brz-eventLayout--filters-form-selectWrapper:hover":
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
    ".brz && .brz-eventLayout--filters input:hover": {
      standart: [
        "cssStyleMinistryElementFiltersTypography",
        "cssStyleMinistryElementFiltersInputColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--filters fieldset:hover ": {
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
    ".brz && .brz-eventLayout--featured__item-title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleColor",
        "cssStyleElementOfMinistryBrandsTitleTypography"
      ],
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
    ".brz && .brz-eventLayout--featured__item p:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsDateTypography",
        "cssStyleElementOfMinistryBrandsDateColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--featured__preview > div > span:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPreviewTypography",
        "cssStyleElementOfMinistryBrandsPreviewColor"
      ],
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
    ".brz && .brz-eventLayout--list-item__grouping-day:hover": {
      standart: [
        "cssStyleElementEventLayoutGroupingDayTypography",
        "cssStyleElementEventLayoutGroupingDayColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--list-item__grouping-date:hover": {
      standart: [
        "cssStyleElementEventLayoutGroupingDateTypography",
        "cssStyleElementEventLayoutGroupingDateColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--list-item__content-date:hover": {
      standart: [
        "cssStyleElementEventLayoutListItemDateTypography",
        "cssStyleElementEventLayoutListItemDateColor",
        "cssStyleElementEventLayoutListItemDateBackgroundColor",
        "cssStyleElementEventLayoutListItemDateBackgroundGradient"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--list-item__content__heading:hover": {
      standart: [
        "cssStyleElementEventLayoutListItemTitleTypography",
        "cssStyleElementEventLayoutListItemTitleColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--list-item__content__meta:hover": {
      standart: [
        "cssStyleElementEventLayoutListItemMetaTypography",
        "cssStyleElementEventLayoutListItemMetaColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
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
    },
    ".brz && .brz-eventLayout--calendar-heading:hover": {
      standart: [
        "cssStyleElementEventLayoutCalendarHeadingTypography",
        "cssStyleElementEventLayoutCalendarHeadingColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--calendar-day:hover": {
      standart: [
        "cssStyleElementEventLayoutCalendarDaysTypography",
        "cssStyleElementEventLayoutCalendarDaysBorder"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout--calendar-day li span:hover": {
      standart: [
        "cssStyleElementEventLayoutCalendarEventsTypography",
        "cssStyleElementEventLayoutCalendarEventsColor"
      ],
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
