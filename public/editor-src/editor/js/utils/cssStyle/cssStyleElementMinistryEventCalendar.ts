import { WithRenderContext } from "visual/providers/RenderProvider";
import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBorderRadiusType,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleCustomIconColor,
  cssStyleFlexHorizontalAlign,
  cssStyleHoverTransition,
  cssStyleIconMargin,
  cssStyleIconPosition,
  cssStyleSizeHeight,
  cssStyleSizeWidth,
  cssStyleStrokeWidth,
  cssStyleTextAlign,
  getAllCssStyleTypography
} from "visual/utils/cssStyle";
import { read as readNumber } from "visual/utils/reader/number";
import { read as readString } from "visual/utils/reader/string";
import { CSSValue } from "visual/utils/style2/types";
import { defaultValueValue } from "../onChange";
import {
  cssStyleElementMinistryBrandsButtonsBgColor,
  cssStyleElementMinistryBrandsButtonsBgGradient
} from "./cssStyleElementMinistryBrands";

export function cssStyleElementMinistryEventCalendarTitleAlign({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleElementMinistryEventCalendarPaginationSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const spacing = readNumber(dvv("paginationSpacing")) ?? 10;
  const spacingSuffix = readString(dvv("paginationSpacingSuffix")) ?? "px";

  return `margin: 0 ${spacing / 2}${spacingSuffix}}`;
}

export function cssStyleElementMinistryEventCalendarPaginationAlign({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "pagination"
  });
}

export function cssStyleElementMinistryEventCalendarWeekdaysTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "weekdaysTypography",
    renderContext
  });
}

export function cssStyleElementMinistryEventCalendarWeekdaysColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "weekdaysColor"
  });
}

export function cssStyleElementMinistryEventCalendarWeekdaysAlign({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "weekdays"
  });
}
// Event Start Time
export function cssStyleElementMinistryEventCalendarEventStartTimeTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "eventStartTimeTypography",
    renderContext
  });
}

export function cssStyleElementMinistryEventCalendarEventStartTimeColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "eventStartTimeColor"
  });
}

// Days
export function cssStyleElementMinistryEventCalendarDayTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "dayTypography",
    renderContext
  });
}

export function cssStyleElementMinistryEventCalendarDayColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "dayColor"
  });
}

export function cssStyleElementMinistryEventCalendarDayBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "dayBg"
  });
}

export function cssStyleElementMinistryEventCalendarDayBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "day"
  });
}

export function cssStyleElementMinistryEventCalendarDayBorder({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, getConfig, prefix: "day" });
}

export function cssStyleElementMinistryEventCalendarDayBorderRadius({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "day"
  });
}

export function cssStyleElementMinistryEventCalendarDayBoxShadow({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "day"
  });
}

export function cssStyleElementMinistryEventCalendarDayAlign({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "day"
  });
}

export function cssStyleElementMinistryEventCalendarDayWidth({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "day"
  });
}

export function cssStyleElementMinistryEventCalendarDayHeight({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleSizeHeight({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "day"
  });
}

// Empty Day
export function cssStyleElementMinistryEventCalendarEmptyBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "emptyBg"
  });
}

export function cssStyleElementMinistryEventCalendarEmptyBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "empty"
  });
}

// Table
export function cssStyleElementMinistryEventCalendarEvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "evenBg"
  });
}

export function cssStyleElementMinistryEventCalendarEvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "even"
  });
}

export function cssStyleElementMinistryEventCalendarOddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "oddBg"
  });
}

export function cssStyleElementMinistryEventCalendarOddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "odd"
  });
}

export function cssStyleElementMinistryEventCalendarMonth2EvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month2EvenBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth2EvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month2Even"
  });
}

export function cssStyleElementMinistryEventCalendarMonth2OddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month2OddBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth2OddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month2Odd"
  });
}

export function cssStyleElementMinistryEventCalendarMonth3EvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month3EvenBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth3EvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month3Even"
  });
}

export function cssStyleElementMinistryEventCalendarMonth3OddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month3OddBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth3OddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month3Odd"
  });
}

export function cssStyleElementMinistryEventCalendarMonth4EvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month4EvenBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth4EvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month4Even"
  });
}

export function cssStyleElementMinistryEventCalendarMonth4OddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month4OddBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth4OddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month4Odd"
  });
}

export function cssStyleElementMinistryEventCalendarMonth5EvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month5EvenBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth5EvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month5Even"
  });
}

export function cssStyleElementMinistryEventCalendarMonth5OddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month5OddBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth5OddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month5Odd"
  });
}

export function cssStyleElementMinistryEventCalendarMonth6EvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month6EvenBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth6EvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month6Even"
  });
}

export function cssStyleElementMinistryEventCalendarMonth6OddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month6OddBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth6OddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month6Odd"
  });
}

export function cssStyleElementMinistryEventCalendarMonth7EvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month7EvenBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth7EvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month7Even"
  });
}

export function cssStyleElementMinistryEventCalendarMonth7OddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month7OddBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth7OddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month7Odd"
  });
}

export function cssStyleElementMinistryEventCalendarMonth8EvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month8EvenBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth8EvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month8Even"
  });
}

export function cssStyleElementMinistryEventCalendarMonth8OddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month8OddBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth8OddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month8Odd"
  });
}

export function cssStyleElementMinistryEventCalendarMonth9EvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month9EvenBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth9EvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month9Even"
  });
}

export function cssStyleElementMinistryEventCalendarMonth9OddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month9OddBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth9OddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month9Odd"
  });
}

export function cssStyleElementMinistryEventCalendarMonth10EvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month10EvenBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth10EvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month10Even"
  });
}

export function cssStyleElementMinistryEventCalendarMonth10OddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month10OddBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth10OddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month10Odd"
  });
}

export function cssStyleElementMinistryEventCalendarMonth11EvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month11EvenBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth11EvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month11Even"
  });
}

export function cssStyleElementMinistryEventCalendarMonth11OddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month11OddBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth11OddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month11Odd"
  });
}

export function cssStyleElementMinistryEventCalendarMonth12EvenBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month12EvenBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth12EvenBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month12Even"
  });
}

export function cssStyleElementMinistryEventCalendarMonth12OddBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month12OddBg"
  });
}

export function cssStyleElementMinistryEventCalendarMonth12OddBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "month12Odd"
  });
}

export function cssStyleElementMinistryEventCalendarTableSpacing({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const spacing = dvv("borderSpacing");
  const suffix = dvv("borderSpacingSuffix");

  return `border-spacing:${spacing}${suffix};`;
}

export function cssStyleElementMinistryEventCalendarTableBorder({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "table"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendarTypography",
    renderContext
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendarColor"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarBgColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleElementMinistryBrandsButtonsBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarBgGradient({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleElementMinistryBrandsButtonsBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarBorder({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarBoxShadow({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarWidth({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarHeight({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleSizeHeight({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarBorderRadius({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorderRadiusType({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarAlign({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarIconPosition({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleIconPosition({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "icon"
  });
}

export function cssStyleElementMinistryEventCalendarIconMargin({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleIconMargin({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "icon"
  });
}

export function cssStyleElementMinistryEventCalendarIconStrokeWidth({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleStrokeWidth({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "icon"
  });
}

export function cssStyleElementMinistryEventCalendarArrowColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "arrowColor"
  });
}

export function cssStyleElementMinistryEventCalendarArrowBorder({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "arrow"
  });
}

export function cssStyleElementMinistryEventCalendarArrowBoxShadow({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "arrow"
  });
}

export function cssStyleElementMinistryEventCalendarArrowSize({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const arrowSize = readNumber(dvv("arrowSize")) ?? 16;
  const arrowSizeSuffix = readString(dvv("arrowSizeSuffix")) ?? "px";

  return `font-size:${arrowSize}${arrowSizeSuffix};`;
}

export function cssStyleElementMinistryEventCalendarHoverTransition({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue) {
  return cssStyleHoverTransition({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarCustomIconColor({
  v,
  device,
  state,
  store,
  getConfig
}: CSSValue): string {
  return cssStyleCustomIconColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subscribeToCalendarColor"
  });
}
