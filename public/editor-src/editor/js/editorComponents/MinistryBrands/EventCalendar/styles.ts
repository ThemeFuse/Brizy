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
    ".brz && .brz-eventCalendar-row:nth-child(even):hover": {
      standart: [
        "cssStyleElementMinistryEventCalendarEvenBgColor",
        "cssStyleElementMinistryEventCalendarEvenBgGradient"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz && .brz-eventCalendar-row:nth-child(odd):hover": {
      standart: [
        "cssStyleElementMinistryEventCalendarOddBgColor",
        "cssStyleElementMinistryEventCalendarOddBgGradient"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-eventCalendar-row-weekdays th": {
      standart: [
        "cssStyleElementMinistryEventCalendarTableBorder",
        "cssStyleElementMinistryEventCalendarWeekdaysAlign"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-eventCalendar-row td": {
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
