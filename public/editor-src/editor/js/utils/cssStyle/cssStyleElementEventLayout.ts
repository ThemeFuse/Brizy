import { hexToRgba } from "../color";
import { defaultValueValue } from "../onChange";
import { getOptionColorHexByPalette } from "../options";
import { ACTIVE } from "../stateMode";
import type { CSSValue } from "../style2/types";
import { cssStyleFlexHorizontalAlign } from "./cssStyleAlign";
import { cssStyleBgColor } from "./cssStyleBgColor";
import { cssStyleBgGradient } from "./cssStyleBgGradient";
import { cssStyleBorder } from "./cssStyleBorder";
import { cssStyleColor } from "./cssStyleColor";
import { getAllCssStyleTypography } from "./cssStyleTypography2";

export const cssStyleElementEventLayoutViewTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "layoutViewTypography"
  });
};

export const cssStyleElementEventLayoutViewBgColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgColor({
    v,
    device,
    state,
    prefix: "viewBg"
  });
};

export const cssStyleElementEventLayoutViewBgGradient = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgGradient({
    v,
    device,
    state,
    prefix: "view"
  });
};

export const cssStyleElementEventLayoutViewBgColorActive = ({
  v,
  device
}: CSSValue): string => {
  return cssStyleBgColor({
    v,
    device,
    state: ACTIVE,
    prefix: "viewBg"
  });
};

export const cssStyleElementEventLayoutListTitleBorderBottom = ({
  v,
  device,
  state
}: CSSValue): string => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const borderColor = dvv("listBorderColorHex");
  const borderStyle = dvv("listBorderStyle");
  const borderPalette = dvv("listBorderColorPalette");
  const borderWidth =
    dvv("listBorderWidthType") === "grouped"
      ? dvv("listBorderWidth")
      : dvv("listBorderBottomWidth");
  const borderOpacity = dvv("listBorderColorOpacity");

  const { hex: _borderColorHex } = getOptionColorHexByPalette(
    borderColor,
    borderPalette
  );

  const _borderColor = hexToRgba(_borderColorHex, borderOpacity);

  return `border-bottom-width:${borderWidth}px; border-bottom-style:${borderStyle}; border-bottom-color:${_borderColor};`;
};

export const cssStyleElementEventLayoutListPaginationTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "listPaginationTypography"
  });
};

export const cssStyleElementEventLayoutListPaginationColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "listPaginationColor"
  });
};

export const cssStyleElementEventLayoutListPaginationSpacing = ({
  v,
  device,
  state
}: CSSValue): string => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const spacing = dvv("listPaginationSpacing");

  return `padding:0 ${spacing}px;`;
};

export const cssStyleElementEventLayoutListTitleTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "listTitleTypography"
  });
};

export const cssStyleElementEventLayoutListTitleColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "listTitleColor"
  });
};

export const cssStyleElementEventLayoutListItemDateTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "listItemDateTypography"
  });
};

export const cssStyleElementEventLayoutListItemDateColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "listItemDateColor"
  });
};

export const cssStyleElementEventLayoutListItemDateBackgroundColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgColor({
    v,
    device,
    state,
    prefix: "listItemDateBg"
  });
};

export function cssStyleElementEventLayoutListItemDateBackgroundGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    prefix: "listItemDate"
  });
}

export const cssStyleElementEventLayoutListItemTitleTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "listItemTitleTypography"
  });
};

export const cssStyleElementEventLayoutListItemTitleColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "listItemTitleColor"
  });
};

export const cssStyleElementEventLayoutListItemMetaTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "listItemMetaTypography"
  });
};

export const cssStyleElementEventLayoutListItemMetaColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "listItemMetaColor"
  });
};

export const cssStyleElementEventLayoutCalendarHeadingTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "calendarHeadingTypography"
  });
};

export const cssStyleElementEventLayoutCalendarHeadingColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "calendarHeadingColor"
  });
};

export const cssStyleElementEventLayoutCalendarDaysTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "calendarDaysTypography"
  });
};

export const cssStyleElementEventLayoutCalendarDaysColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "calendarDaysColor"
  });
};

export const cssStyleElementEventLayoutCalendarDaysBorder = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "calendarDays"
  });
};

export const cssStyleElementEventLayoutCalendarDaysBgColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgColor({
    v,
    device,
    state,
    prefix: "calendarDaysBg"
  });
};

export const cssStyleElementEventLayoutCalendarDaysBgGradient = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgGradient({
    v,
    device,
    state,
    prefix: "calendarDays"
  });
};

export const cssStyleElementEventLayoutViewColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "viewColor"
  });
};

export const cssStyleElementEventLayoutViewColorActive = ({
  v,
  device
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state: ACTIVE,
    prefix: "viewColor"
  });
};

export const cssStyleElementEventLayoutViewBorder = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "view"
  });
};

export const cssStyleElementEventLayoutViewBorderActive = ({
  v,
  device
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state: ACTIVE,
    prefix: "view"
  });
};

export const cssStyleElementEventLayoutViewBgGradientActive = ({
  v,
  device
}: CSSValue): string => {
  return cssStyleBgGradient({
    v,
    device,
    state: ACTIVE,
    prefix: "view"
  });
};

export const cssStyleElementEventLayoutCalendarEventsColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "eventsColor"
  });
};

export const cssStyleElementEventLayoutCalendarEventsTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "eventsTypography"
  });
};

export function cssStyleElementEventLayoutTabAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    prefix: "tab"
  });
}

export function cssStylePropertyEventLayoutHoverTransition(): string {
  return "transition-property: filter, color, opacity, background, border-color, box-shadow;";
}
