import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const { visibleMonth = 1 } = v;
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover .brz-ministryBrands.brz-eventCalendar": {
      standart: [
        "cssStylePaddingBG",
        "cssStyleBorderRadius",
        "cssStylementOfMinistryBrandsParentBgColor",
        "cssStylementOfMinistryBrandsParentBgGradient",
        "cssStylementOfMinistryBrandsParentBorder",
        "cssStylementOfMinistryBrandsParentBoxShadow",
        "cssStyleElementMinistryEventCalendarTableSpacing"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-eventCalendar-table": {
      standart: ["cssStyleElementMinistryEventCalendarTableSpacing"],
      interval: ["cssStyleHoverTransition"]
    },
    [`.brz && .brz-eventCalendar .brz-eventCalendar_wrap .brz-eventCalendar-layout .brz-eventCalendar-month.brz-eventCalendar-month${visibleMonth}`]:
      {
        standart: IS_EDITOR ? ["cssStyleDisplayBlock"] : []
      },
    ".brz && .brz-eventCalendar-month1 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarEvenBgColor",
          "cssStyleElementMinistryEventCalendarEvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month1 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarOddBgColor",
          "cssStyleElementMinistryEventCalendarOddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month2 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth2EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth2EvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month2 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth2OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth2OddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month3 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth3EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth3EvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month3 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth3OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth3OddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month4 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth4EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth4EvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month4 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth4OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth4OddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },

    ".brz && .brz-eventCalendar-month5 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth5EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth5EvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month5 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth5OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth5OddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },

    ".brz && .brz-eventCalendar-month6 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth6EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth6EvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month6 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth6OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth6OddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },

    ".brz && .brz-eventCalendar-month7 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth7EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth7EvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month7 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth7OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth7OddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },

    ".brz && .brz-eventCalendar-month8 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth8EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth8EvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month8 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth8OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth8OddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },

    ".brz && .brz-eventCalendar-month9 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth9EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth9EvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month9 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth9OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth9OddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },

    ".brz && .brz-eventCalendar-month10 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth10EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth10EvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month10 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth10OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth10OddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },

    ".brz && .brz-eventCalendar-month11 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth11EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth11EvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month11 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth11OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth11OddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },

    ".brz && .brz-eventCalendar-month12 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth12EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth12EvenBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz && .brz-eventCalendar-month12 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth12OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth12OddBgGradient"
        ],
        interval: ["cssStyleHoverTransition"]
      },

    ".brz &&:hover .brz-eventCalendar-row-weekdays th": {
      standart: ["cssStyleElementMinistryEventCalendarWeekdaysAlign"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventCalendar-row-weekdays tr:not(:first-child) th:hover": {
      standart: ["cssStyleElementMinistryEventCalendarTableBorder"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventCalendar-row td:hover": {
      standart: ["cssStyleElementMinistryEventCalendarTableBorder"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventCalendar-pagination:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationTypography",
        "cssStyleElementOfMinistryBrandsPaginationColor",
        "cssStyleElementMinistryEventCalendarPaginationAlign"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventCalendar-pagination .brz-eventCalendar-heading": {
      standart: [
        "cssStyleElementMinistryEventCalendarPaginationRight",
        "cssStyleElementMinistryEventCalendarPaginationLeft"
      ]
    },
    ".brz && tr.brz-eventCalendar-row-weekdays th span:hover": {
      standart: [
        "cssStyleElementMinistryEventCalendarWeekdaysTypography",
        "cssStyleElementMinistryEventCalendarWeekdaysColor",
        "cssStyleElementMinistryEventCalendarWeekdaysAlign"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventCalendar-day:hover .brz-eventCalendar-day-number": {
      standart: ["cssStyleElementMinistryEventCalendarDayAlign"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventCalendar-day:hover .brz-eventCalendar-day-number span": {
      standart: [
        "cssStyleElementMinistryEventCalendarDayTypography",
        "cssStyleElementMinistryEventCalendarDayColor",
        "cssStyleElementMinistryEventCalendarDayWidth",
        "cssStyleElementMinistryEventCalendarDayHeight",
        "cssStyleElementMinistryEventCalendarDayBgColor",
        "cssStyleElementMinistryEventCalendarDayBgGradient",
        "cssStyleElementMinistryEventCalendarDayBorder",
        "cssStyleElementMinistryEventCalendarDayBorderRadius",
        "cssStyleElementMinistryEventCalendarDayBoxShadow"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventCalendar-links": {
      standart: ["cssStyleElementMinistryEventCalendarTitleAlign"]
    },
    ".brz && .brz-eventCalendar-links li .brz-eventCalendar-title:hover": {
      standart: [
        "cssStyleElementOfMinistryBrandsTitleTypography",
        "cssStyleElementOfMinistryBrandsTitleColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventCalendar-links .brz-eventCalendar__event-start-time:hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarEventStartTimeTypography",
          "cssStyleElementMinistryEventCalendarEventStartTimeColor"
        ],
        interval: ["cssStyleHoverTransition"]
      },
    ".brz &&:hover .brz-eventCalendar-day-np": {
      standart: [
        "cssStyleElementMinistryEventCalendarTableBorder",
        "cssStyleElementMinistryEventCalendarEmptyBgColor",
        "cssStyleElementMinistryEventCalendarEmptyBgGradient"
      ],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
