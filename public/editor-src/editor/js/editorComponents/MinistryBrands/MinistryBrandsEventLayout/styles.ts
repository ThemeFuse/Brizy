import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
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
    ".brz && .brz-eventLayout iframe, .brz && .brz-eventLayout video, .brz && .brz-eventLayout img, .brz && .brz-eventLayout--featured__preview":
      {
        standart: ["cssStyleMinistryElementMediaBorderRadius"]
      },
    ".brz && .brz-eventLayout--featured": {
      standart: ["cssStyleElementOfMinistryBrandsColumnsNumberWithSpacing"]
    },
    ".brz && .brz-eventLayout--featured__item": {
      standart: ["cssStyleElementOfMinistryBrandsHorizontalAlign"]
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
    ".brz && .brz-eventLayout--filters .brz-eventLayout--filters-form-selectWrapper:hover  select option":
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
    ".brz && .brz-eventLayout--featured__preview:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPreviewTypography",
        "cssStyleElementOfMinistryBrandsPreviewColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout__pagination:hover": {
      standart: [
        "cssStyleElementEventLayoutListPaginationTypography",
        "cssStyleElementEventLayoutListPaginationColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-eventLayout__pagination span": {
      standart: ["cssStyleElementEventLayoutListPaginationSpacing"]
    },
    ".brz && .brz-eventLayout--list-item__title:hover": {
      standart: [
        "cssStyleElementEventLayoutListTitleTypography",
        "cssStyleElementEventLayoutListTitleColor",
        "cssStyleElementEventLayoutListTitleBorderBottom"
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
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
