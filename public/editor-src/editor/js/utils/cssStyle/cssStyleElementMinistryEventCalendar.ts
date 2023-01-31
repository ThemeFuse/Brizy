import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleFlexHorizontalAlign,
  cssStyleSizeHeight,
  cssStyleSizeWidth,
  cssStyleSpacing,
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
