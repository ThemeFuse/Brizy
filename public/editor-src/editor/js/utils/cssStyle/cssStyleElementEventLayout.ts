import { Num, Str } from "@brizy/readers";
import { WithRenderContext } from "visual/providers/RenderProvider";
import { getColor } from "visual/utils/color";
import { isNullish } from "visual/utils/value";
import { defaultValueValue } from "../onChange";
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
  state,
  getConfig,
  store,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "layoutViewTypography",
    renderContext
  });
};

export const cssStyleElementEventLayoutViewBgColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleBgColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "viewBg"
  });
};

export const cssStyleElementEventLayoutViewBgGradient = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleBgGradient({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "view"
  });
};

export const cssStyleElementEventLayoutViewBgColorActive = ({
  v,
  device,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleBgColor({
    v,
    device,
    state: ACTIVE,
    store,
    getConfig,
    prefix: "viewBg"
  });
};

export const cssStyleElementEventLayoutListTitleBorderBottom = ({
  v,
  device,
  state,
  getConfig
}: CSSValue): string => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const borderPalette = Str.read(dvv("listBorderColorPalette"));
  const borderColor = Str.read(dvv("listBorderColorHex"));
  const borderOpacity = Num.read(dvv("listBorderColorOpacity"));
  const borderStyle = dvv("listBorderStyle");
  const borderWidth =
    dvv("listBorderWidthType") === "grouped"
      ? dvv("listBorderWidth")
      : dvv("listBorderBottomWidth");

  if (
    isNullish(borderPalette) ||
    isNullish(borderColor) ||
    isNullish(borderOpacity)
  ) {
    return "";
  }

  const config = getConfig();

  const _borderColor = getColor(
    borderPalette,
    borderColor,
    borderOpacity,
    config
  );

  return `border-bottom-width:${borderWidth}px; border-bottom-style:${borderStyle}; border-bottom-color:${_borderColor};`;
};

export const cssStyleElementEventLayoutListPaginationTypography = ({
  v,
  device,
  state,
  getConfig,
  store,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listPaginationTypography",
    renderContext
  });
};

export const cssStyleElementEventLayoutListPaginationColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listPaginationColor"
  });
};

export const cssStyleElementEventLayoutListPaginationArrowsColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listPaginationArrowsColor"
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

export const cssStyleElementEventLayoutGroupingDayTypography = ({
  v,
  device,
  state,
  getConfig,
  store,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listTitleTypography",
    renderContext
  });
};

export const cssStyleElementEventLayoutGroupingDateTypography = ({
  v,
  device,
  state,
  getConfig,
  store,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "groupingDateTypography",
    renderContext
  });
};

export const cssStyleElementEventLayoutGroupingDayColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listTitleColor"
  });
};

export const cssStyleElementEventLayoutGroupingDateColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "groupingDateColor"
  });
};

export const cssStyleElementEventLayoutListItemDateTypography = ({
  v,
  device,
  state,
  getConfig,
  store,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listItemDateTypography",
    renderContext
  });
};

export const cssStyleElementEventLayoutListItemDateColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listItemDateColor"
  });
};

export const cssStyleElementEventLayoutListItemDateBackgroundColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleBgColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listItemDateBg"
  });
};

export function cssStyleElementEventLayoutListItemDateBackgroundGradient({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listItemDate"
  });
}

export const cssStyleElementEventLayoutListItemTitleTypography = ({
  v,
  device,
  state,
  getConfig,
  store,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listItemTitleTypography",
    renderContext
  });
};

export const cssStyleElementEventLayoutListItemTitleColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listItemTitleColor"
  });
};

export const cssStyleElementEventLayoutListItemMetaTypography = ({
  v,
  device,
  state,
  getConfig,
  store,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listItemMetaTypography",
    renderContext
  });
};

export const cssStyleElementEventLayoutListItemMetaColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "listItemMetaColor"
  });
};

export const cssStyleElementEventLayoutCalendarHeadingTypography = ({
  v,
  device,
  state,
  getConfig,
  store,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "calendarHeadingTypography",
    renderContext
  });
};

export const cssStyleElementEventLayoutCalendarHeadingColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "calendarHeadingColor"
  });
};

export const cssStyleElementEventLayoutCalendarDaysTypography = ({
  v,
  device,
  state,
  getConfig,
  store,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "calendarDaysTypography",
    renderContext
  });
};

export const cssStyleElementEventLayoutCalendarDaysColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "calendarDaysColor"
  });
};

export const cssStyleElementEventLayoutCalendarDaysBorder = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "calendarDays"
  });
};

export const cssStyleElementEventLayoutCalendarDaysBgColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleBgColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "calendarDaysBg"
  });
};

export const cssStyleElementEventLayoutCalendarDaysBgGradient = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleBgGradient({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "calendarDays"
  });
};

export const cssStyleElementEventLayoutViewColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "viewColor"
  });
};

export const cssStyleElementEventLayoutViewColorActive = ({
  v,
  device,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state: ACTIVE,
    store,
    getConfig,
    prefix: "viewColor"
  });
};

export const cssStyleElementEventLayoutViewBorder = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "view"
  });
};

export const cssStyleElementEventLayoutViewBorderActive = ({
  v,
  device,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state: ACTIVE,
    store,
    getConfig,
    prefix: "view"
  });
};

export const cssStyleElementEventLayoutViewBgGradientActive = ({
  v,
  device,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleBgGradient({
    v,
    device,
    state: ACTIVE,
    store,
    getConfig,
    prefix: "view"
  });
};

export const cssStyleElementEventLayoutCalendarEventsColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "eventsColor"
  });
};

export const cssStyleElementEventLayoutCalendarEventsTypography = ({
  v,
  device,
  state,
  getConfig,
  store,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "eventsTypography",
    renderContext
  });
};

export function cssStyleElementEventLayoutTabAlign({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "tab"
  });
}

export function cssStylePropertyEventLayoutHoverTransition(): string {
  return "transition-property: filter, color, opacity, background, border-color, box-shadow;";
}
