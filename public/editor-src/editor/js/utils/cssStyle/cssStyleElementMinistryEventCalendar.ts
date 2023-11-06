import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleFlexHorizontalAlign,
  cssStyleIconMargin,
  cssStyleIconPosition,
  cssStyleSizeHeight,
  cssStyleSizeWidth,
  cssStyleSpacing,
  cssStyleStrokeWidth,
  cssStyleTextAlign,
  getAllCssStyleTypography
} from "visual/utils/cssStyle";
import { CSSValue } from "visual/utils/style2/types";
import { defaultValueValue } from "../onChange";

export function cssStyleElementMinistryEventCalendarTitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "title" });
}

export function cssStyleElementMinistryEventCalendarPaginationRight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "pagination",
    direction: "right"
  });
}

export function cssStyleElementMinistryEventCalendarPaginationLeft({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "pagination",
    direction: "left"
  });
}

export function cssStyleElementMinistryEventCalendarPaginationAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    prefix: "pagination"
  });
}

export function cssStyleElementMinistryEventCalendarWeekdaysTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "weekdaysTypography"
  });
}

export function cssStyleElementMinistryEventCalendarWeekdaysColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "weekdaysColor" });
}

export function cssStyleElementMinistryEventCalendarWeekdaysAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "weekdays" });
}
// Event Start Time
export function cssStyleElementMinistryEventCalendarEventStartTimeTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "eventStartTimeTypography"
  });
}

export function cssStyleElementMinistryEventCalendarEventStartTimeColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "eventStartTimeColor" });
}

// Days
export function cssStyleElementMinistryEventCalendarDayTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "dayTypography"
  });
}

export function cssStyleElementMinistryEventCalendarDayColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "dayColor" });
}

export function cssStyleElementMinistryEventCalendarDayBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "dayBg" });
}

export function cssStyleElementMinistryEventCalendarDayBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "day" });
}

export function cssStyleElementMinistryEventCalendarDayBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "day" });
}

export function cssStyleElementMinistryEventCalendarDayBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "day" });
}

export function cssStyleElementMinistryEventCalendarDayBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "day" });
}

export function cssStyleElementMinistryEventCalendarDayAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "day" });
}

export function cssStyleElementMinistryEventCalendarDayWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    state,
    prefix: "day"
  });
}

export function cssStyleElementMinistryEventCalendarDayHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({
    v,
    device,
    state,
    prefix: "day"
  });
}

// Empty Day
export function cssStyleElementMinistryEventCalendarEmptyBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "emptyBg" });
}

export function cssStyleElementMinistryEventCalendarEmptyBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "empty" });
}

// Table
export function cssStyleElementMinistryEventCalendarEvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "evenBg" });
}

export function cssStyleElementMinistryEventCalendarEvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "even" });
}

export function cssStyleElementMinistryEventCalendarOddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "oddBg" });
}

export function cssStyleElementMinistryEventCalendarOddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "odd" });
}

export function cssStyleElementMinistryEventCalendarMonth2EvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month2EvenBg" });
}

export function cssStyleElementMinistryEventCalendarMonth2EvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month2Even" });
}

export function cssStyleElementMinistryEventCalendarMonth2OddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month2OddBg" });
}

export function cssStyleElementMinistryEventCalendarMonth2OddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month2Odd" });
}

export function cssStyleElementMinistryEventCalendarMonth3EvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month3EvenBg" });
}

export function cssStyleElementMinistryEventCalendarMonth3EvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month3Even" });
}

export function cssStyleElementMinistryEventCalendarMonth3OddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month3OddBg" });
}

export function cssStyleElementMinistryEventCalendarMonth3OddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month3Odd" });
}

export function cssStyleElementMinistryEventCalendarMonth4EvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month4EvenBg" });
}

export function cssStyleElementMinistryEventCalendarMonth4EvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month4Even" });
}

export function cssStyleElementMinistryEventCalendarMonth4OddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month4OddBg" });
}

export function cssStyleElementMinistryEventCalendarMonth4OddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month4Odd" });
}

export function cssStyleElementMinistryEventCalendarMonth5EvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month5EvenBg" });
}

export function cssStyleElementMinistryEventCalendarMonth5EvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month5Even" });
}

export function cssStyleElementMinistryEventCalendarMonth5OddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month5OddBg" });
}

export function cssStyleElementMinistryEventCalendarMonth5OddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month5Odd" });
}

export function cssStyleElementMinistryEventCalendarMonth6EvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month6EvenBg" });
}

export function cssStyleElementMinistryEventCalendarMonth6EvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month6Even" });
}

export function cssStyleElementMinistryEventCalendarMonth6OddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month6OddBg" });
}

export function cssStyleElementMinistryEventCalendarMonth6OddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month6Odd" });
}

export function cssStyleElementMinistryEventCalendarMonth7EvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month7EvenBg" });
}

export function cssStyleElementMinistryEventCalendarMonth7EvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month7Even" });
}

export function cssStyleElementMinistryEventCalendarMonth7OddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month7OddBg" });
}

export function cssStyleElementMinistryEventCalendarMonth7OddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month7Odd" });
}

export function cssStyleElementMinistryEventCalendarMonth8EvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month8EvenBg" });
}

export function cssStyleElementMinistryEventCalendarMonth8EvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month8Even" });
}

export function cssStyleElementMinistryEventCalendarMonth8OddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month8OddBg" });
}

export function cssStyleElementMinistryEventCalendarMonth8OddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month8Odd" });
}

export function cssStyleElementMinistryEventCalendarMonth9EvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month9EvenBg" });
}

export function cssStyleElementMinistryEventCalendarMonth9EvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month9Even" });
}

export function cssStyleElementMinistryEventCalendarMonth9OddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month9OddBg" });
}

export function cssStyleElementMinistryEventCalendarMonth9OddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month9Odd" });
}

export function cssStyleElementMinistryEventCalendarMonth10EvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month10EvenBg" });
}

export function cssStyleElementMinistryEventCalendarMonth10EvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month10Even" });
}

export function cssStyleElementMinistryEventCalendarMonth10OddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month10OddBg" });
}

export function cssStyleElementMinistryEventCalendarMonth10OddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month10Odd" });
}

export function cssStyleElementMinistryEventCalendarMonth11EvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month11EvenBg" });
}

export function cssStyleElementMinistryEventCalendarMonth11EvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month11Even" });
}

export function cssStyleElementMinistryEventCalendarMonth11OddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month11OddBg" });
}

export function cssStyleElementMinistryEventCalendarMonth11OddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month11Odd" });
}

export function cssStyleElementMinistryEventCalendarMonth12EvenBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month12EvenBg" });
}

export function cssStyleElementMinistryEventCalendarMonth12EvenBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month12Even" });
}

export function cssStyleElementMinistryEventCalendarMonth12OddBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "month12OddBg" });
}

export function cssStyleElementMinistryEventCalendarMonth12OddBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "month12Odd" });
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
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "table" });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "subscribeToCalendarTypography"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "subscribeToCalendarColor"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "subscribeToCalendarBg" });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "subscribeToCalendar" });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "subscribeToCalendar" });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    state,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({
    v,
    device,
    state,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarSubscribeToCalendarAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    prefix: "subscribeToCalendar"
  });
}

export function cssStyleElementMinistryEventCalendarIconPosition({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleIconPosition({ v, device, state, prefix: "icon" });
}

export function cssStyleElementMinistryEventCalendarIconMargin({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleIconMargin({ v, device, state, prefix: "icon" });
}

export function cssStyleElementMinistryEventCalendarIconStrokeWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleStrokeWidth({ v, device, state, prefix: "icon" });
}
