import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const {
    v,
    contexts: { renderContext }
  } = data;

  const { visibleMonth = 1 } = v;

  const styles: Styles = {
    ".brz && .brz-ministryBrands.brz-eventCalendar": {
      standart: [
        "cssStylePaddingBG",
        "cssStyleBorderRadius",
        "cssStyleElementMinistryEventCalendarTableSpacing"
      ]
    },
    ".brz &&:hover .brz-ministryBrands.brz-eventCalendar": {
      standart: [
        "cssStylementOfMinistryBrandsParentBgColor",
        "cssStylementOfMinistryBrandsParentBgGradient",
        "cssStylementOfMinistryBrandsParentBorder",
        "cssStylementOfMinistryBrandsParentBoxShadow"
      ]
    },
    ".brz && .brz-eventCalendar-table": {
      standart: ["cssStyleElementMinistryEventCalendarTableSpacing"]
    },
    ".brz && .brz-eventCalendar-pagination a": {
      standart: ["cssStyleElementMinistryEventCalendarArrowSize"]
    },
    ".brz && .brz-eventCalendar-pagination a:hover": {
      standart: [
        "cssStyleElementMinistryEventCalendarArrowColor",
        "cssStyleElementMinistryEventCalendarArrowBoxShadow",
        "cssStyleElementMinistryEventCalendarArrowBorder"
      ]
    },
    [`.brz && .brz-eventCalendar .brz-eventCalendar_wrap .brz-eventCalendar-layout .brz-eventCalendar-month.brz-eventCalendar-month${visibleMonth}`]:
      {
        standart: isEditor(renderContext) ? ["cssStyleDisplayBlock"] : []
      },
    ".brz && .brz-eventCalendar-month1 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarEvenBgColor",
          "cssStyleElementMinistryEventCalendarEvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month1 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarOddBgColor",
          "cssStyleElementMinistryEventCalendarOddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month2 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth2EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth2EvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month2 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth2OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth2OddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month3 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth3EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth3EvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month3 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth3OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth3OddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month4 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth4EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth4EvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month4 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth4OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth4OddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month5 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth5EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth5EvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month5 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth5OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth5OddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month6 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth6EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth6EvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month6 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth6OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth6OddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month7 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth7EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth7EvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month7 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth7OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth7OddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month8 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth8EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth8EvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month8 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth8OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth8OddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month9 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth9EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth9EvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month9 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth9OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth9OddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month10 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth10EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth10EvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month10 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth10OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth10OddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month11 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth11EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth11EvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month11 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth11OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth11OddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month12 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth12EvenBgColor",
          "cssStyleElementMinistryEventCalendarMonth12EvenBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-month12 .brz-eventCalendar-row:nth-child(odd):hover":
      {
        standart: [
          "cssStyleElementMinistryEventCalendarMonth12OddBgColor",
          "cssStyleElementMinistryEventCalendarMonth12OddBgGradient"
        ]
      },
    ".brz && .brz-eventCalendar-row-weekdays th": {
      standart: ["cssStyleElementMinistryEventCalendarWeekdaysAlign"]
    },
    ".brz && .brz-eventCalendar-row-weekdays tr:not(:first-child) th:hover": {
      standart: ["cssStyleElementMinistryEventCalendarTableBorder"]
    },
    ".brz && .brz-eventCalendar-row td:hover": {
      standart: ["cssStyleElementMinistryEventCalendarTableBorder"]
    },
    ".brz && .brz-eventCalendar-pagination": {
      standart: [
        "cssStyleElementOfMinistryBrandsPaginationTypography",
        "cssStyleElementMinistryEventCalendarPaginationAlign"
      ]
    },
    ".brz && .brz-eventCalendar-pagination:hover": {
      standart: ["cssStyleElementOfMinistryBrandsPaginationColor"]
    },
    ".brz && .brz-eventCalendar-pagination .brz-eventCalendar-heading": {
      standart: ["cssStyleElementMinistryEventCalendarPaginationSpacing"]
    },
    ".brz && tr.brz-eventCalendar-row-weekdays th span": {
      standart: [
        "cssStyleElementMinistryEventCalendarWeekdaysTypography",
        "cssStyleElementMinistryEventCalendarWeekdaysAlign"
      ]
    },
    ".brz && tr.brz-eventCalendar-row-weekdays th span:hover": {
      standart: ["cssStyleElementMinistryEventCalendarWeekdaysColor"]
    },
    ".brz && .brz-eventCalendar-day .brz-eventCalendar-day-number": {
      standart: ["cssStyleElementMinistryEventCalendarDayAlign"]
    },
    ".brz && .brz-eventCalendar-day .brz-eventCalendar-day-number span": {
      standart: [
        "cssStyleElementMinistryEventCalendarDayTypography",
        "cssStyleElementMinistryEventCalendarDayWidth",
        "cssStyleElementMinistryEventCalendarDayHeight",
        "cssStyleElementMinistryEventCalendarDayBorderRadius"
      ]
    },
    ".brz && .brz-eventCalendar-day:hover .brz-eventCalendar-day-number span": {
      standart: [
        "cssStyleElementMinistryEventCalendarDayColor",
        "cssStyleElementMinistryEventCalendarDayBgColor",
        "cssStyleElementMinistryEventCalendarDayBgGradient",
        "cssStyleElementMinistryEventCalendarDayBorder",
        "cssStyleElementMinistryEventCalendarDayBoxShadow"
      ]
    },
    ".brz && .brz-eventCalendar-links": {
      standart: ["cssStyleElementMinistryEventCalendarTitleAlign"]
    },
    ".brz && .brz-eventCalendar-links li .brz-eventCalendar-title": {
      standart: ["cssStyleElementOfMinistryBrandsTitleTypography"]
    },
    ".brz && .brz-eventCalendar-links li .brz-eventCalendar-title:hover": {
      standart: ["cssStyleElementOfMinistryBrandsTitleColor"]
    },
    ".brz && .brz-eventCalendar-links .brz-eventCalendar__event-start-time": {
      standart: ["cssStyleElementMinistryEventCalendarEventStartTimeTypography"]
    },
    ".brz && .brz-eventCalendar-links .brz-eventCalendar__event-start-time:hover":
      {
        standart: ["cssStyleElementMinistryEventCalendarEventStartTimeColor"]
      },
    ".brz &&:hover .brz-eventCalendar-day-np": {
      standart: [
        "cssStyleElementMinistryEventCalendarTableBorder",
        "cssStyleElementMinistryEventCalendarEmptyBgColor",
        "cssStyleElementMinistryEventCalendarEmptyBgGradient"
      ]
    },
    ".brz && .brz-eventCalendar__subscribe__container": {
      standart: ["cssStyleElementMinistryEventCalendarSubscribeToCalendarAlign"]
    },
    ".brz && .brz-eventCalendar__subscribe .brz-icon-svg": {
      standart: [
        "cssStyleSizeFontSizeIcon",
        "cssStyleElementMinistryEventCalendarIconMargin",
        "cssStyleElementMinistryEventCalendarIconStrokeWidth"
      ]
    },
    ".brz &&:hover .brz-eventCalendar__subscribe .brz-icon-svg-custom": {
      standart: ["cssStyleElementMinistryEventCalendarCustomIconColor"]
    },
    ".brz && .brz-eventCalendar__subscribe": {
      standart: [
        "cssStyleElementMinistryEventCalendarSubscribeToCalendarTypography",
        "cssStyleElementMinistryEventCalendarSubscribeToCalendarWidth",
        "cssStyleElementMinistryEventCalendarSubscribeToCalendarHeight",
        "cssStyleElementMinistryEventCalendarIconPosition",
        "cssStyleElementMinistryEventCalendarSubscribeToCalendarBorderRadius"
      ]
    },
    ".brz && .brz-eventCalendar__subscribe:hover": {
      standart: [
        "cssStyleElementMinistryEventCalendarSubscribeToCalendarColor",
        "cssStyleElementMinistryEventCalendarSubscribeToCalendarBgColor",
        "cssStyleElementMinistryEventCalendarSubscribeToCalendarBgGradient",
        "cssStyleElementMinistryEventCalendarSubscribeToCalendarBorder",
        "cssStyleElementMinistryEventCalendarSubscribeToCalendarBoxShadow"
      ],
      interval: ["cssStyleElementMinistryEventCalendarHoverTransition"]
    },
    ".brz && .brz-ministryBrands.brz-eventCalendar, .brz && .brz-eventCalendar-pagination a, .brz && .brz-eventCalendar-month1 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month1 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-month2 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month2 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-month3 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month3 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-month4 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month4 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-month5 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month5 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-month6 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month6 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-month7 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month7 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-month8 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month8 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-month9 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month9 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-month10 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month10 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-month11 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month11 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-month12 .brz-eventCalendar-row:nth-child(even) td:not(.brz-eventCalendar-day-np), .brz && .brz-eventCalendar-month12 .brz-eventCalendar-row:nth-child(odd), .brz && .brz-eventCalendar-row-weekdays th, .brz && .brz-eventCalendar-row-weekdays tr:not(:first-child) th, .brz && .brz-eventCalendar-row td, .brz && .brz-eventCalendar-pagination, .brz && tr.brz-eventCalendar-row-weekdays th span, .brz && .brz-eventCalendar-day .brz-eventCalendar-day-number, .brz && .brz-eventCalendar-day .brz-eventCalendar-day-number span, .brz && .brz-eventCalendar-links li .brz-eventCalendar-title, .brz && .brz-eventCalendar-links .brz-eventCalendar__event-start-time, .brz && .brz-eventCalendar-day-np, .brz && .brz-eventCalendar__subscribe .brz-icon-svg-custom":
      {
        standart: ["cssStyleHoverTransition"]
      }
  };

  return renderStyles({ ...data, styles });
}
