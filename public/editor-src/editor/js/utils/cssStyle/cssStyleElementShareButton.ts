import { Color, View } from "visual/editorComponents/ShareButton/types";
import {
  getColor,
  getColumns,
  getNetworkInfo,
  getNetworkType,
  getView
} from "visual/editorComponents/ShareButton/utils";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "../style2/types";
import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleColor,
  cssStyleDisplayFlex,
  cssStyleDisplayNone,
  cssStyleSizeFontSize,
  cssStyleSizeHeight
} from "./index";

type Dvv = (key: string) => unknown;

export function cssStyleElementShareButtonIconSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeFontSize({
    v,
    device,
    state,
    store,
    prefix: "iconCustom"
  });
}

export function cssStyleElementShareButtonWidthText({
  v,
  device
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device });
  const height = dvv("buttonHeight");
  const heightSuffix = dvv("buttonHeightSuffix");
  const width = dvv("buttonWidth");
  const widthSuffix = dvv("buttonWidthSuffix");

  return `padding: ${height}${heightSuffix} ${width}${widthSuffix};`;
}

export function cssStyleElementShareButtonWidthIcon({
  v,
  device
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device });
  const buttonHeight = dvv("buttonHeight");
  const buttonHeightSuffix = dvv("buttonHeightSuffix");
  const iconWidth = dvv("iconWidth");
  const iconWidthSuffix = dvv("iconWidthSuffix");

  return `padding: ${buttonHeight}${buttonHeightSuffix} ${iconWidth}${iconWidthSuffix};`;
}

export function cssStyleElementShareButtonGrid({
  v,
  device
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device });
  const columnsGap = dvv("columnsGap");
  const columnsGapSuffix = dvv("columnsGapSuffix");
  const rowsGap = dvv("rowsGap");
  const rowsGapSuffix = dvv("rowsGapSuffix");

  return `grid-column-gap: ${columnsGap}${columnsGapSuffix}; grid-row-gap: ${rowsGap}${rowsGapSuffix};`;
}

export function cssStyleElementShareButtonColumns({
  v,
  device
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device });
  const columns = getColumns(dvv("columns"));

  if (!columns) {
    return "";
  }

  if (columns === "auto") {
    return "display: inline-flex; flex-wrap: wrap;";
  } else
    return `display: grid; grid-template-columns: repeat(${columns}, 1fr); width: 100%;`;
}

export function cssStyleElementShareButtonColumnsIcon({
  v,
  device
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device });
  const columns = getColumns(dvv("columns"));

  if (!columns || columns === "auto") {
    return "";
  } else return "width: 100%;";
}

export function cssStyleElementShareButtonHeight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, store, prefix: "button" });
}

export function cssStyleElementShareButtonViewIcon({
  v,
  device
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device });
  const view = getView(dvv("view"));

  if (view === View.Text) {
    return cssStyleDisplayNone();
  } else {
    return cssStyleDisplayFlex();
  }
}

export function cssStyleElementShareButtonViewText({
  v,
  device
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device });
  const view = getView(dvv("view"));

  if (view === View.Icon) {
    return cssStyleDisplayNone();
  } else {
    return cssStyleDisplayFlex();
  }
}

export function cssStyleElementShareButtonBgColorIcon({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device });

  const network = getNetworkType(dvv("network"));
  const colorType = getColor(dvv("colorType"));

  if (colorType === Color.Official && network) {
    const networkColorText = getNetworkInfo(network);

    return `background-color: ${networkColorText.colorBgIcon};`;
  } else {
    return cssStyleBgColor({ v, device, state, store, prefix: "iconBg" });
  }
}

export function cssStyleElementShareButtonBgGradientIcon({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device });

  const network = getNetworkType(dvv("network"));
  const colorType = getColor(dvv("colorType"));

  if (colorType === Color.Official && network) {
    const networkColorText = getNetworkInfo(network);

    return `background-color: ${networkColorText.colorBgIcon};`;
  } else {
    return cssStyleBgGradient({ v, device, state, store, prefix: "icon" });
  }
}

export function cssStyleElementShareButtonBgColorText({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device });

  const network = getNetworkType(dvv("network"));
  const colorType = getColor(dvv("colorType"));

  if (colorType === Color.Official && network) {
    const networkColorIcon = getNetworkInfo(network);

    return `background-color: ${networkColorIcon.colorBgText};`;
  } else {
    return cssStyleBgColor({ v, device, state, store, prefix: "textBg" });
  }
}

export function cssStyleElementShareButtonBgGradientText({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device });

  const network = getNetworkType(dvv("network"));
  const colorType = getColor(dvv("colorType"));

  if (colorType === Color.Official && network) {
    const networkColorIcon = getNetworkInfo(network);

    return `background-color: ${networkColorIcon.colorBgText};`;
  } else {
    return cssStyleBgGradient({ v, device, state, store, prefix: "text" });
  }
}

export function cssStyleElementShareButtonCustomColorText({
  v,
  device,
  state,
  store,
  prefix = "textColor"
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device, state });
  const colorType = getColor(dvv("colorType"));

  if (colorType === Color.Official) {
    return "color: #ffffff;";
  } else {
    return cssStyleColor({ v, device, state, store, prefix });
  }
}

export function cssStyleElementShareButtonCustomColorIcon({
  v,
  device,
  state,
  store,
  prefix = "iconColor"
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device, state });
  const colorType = getColor(dvv("colorType"));

  if (colorType === Color.Official) {
    return "color: #ffffff;";
  } else {
    return cssStyleColor({ v, device, state, store, prefix });
  }
}

export function cssStyleElementShareButtonBorderColor({
  v,
  device,
  state
}: CSSValue): string {
  const dvv: Dvv = (key) => defaultValueValue({ v, key, device, state });
  const colorType = getColor(dvv("colorType"));

  if (colorType === Color.Official) {
    return "border: 0;";
  } else {
    return cssStyleBorder({ v, device, state });
  }
}
