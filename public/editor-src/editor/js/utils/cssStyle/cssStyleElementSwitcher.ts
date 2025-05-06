import {
  cssStyleBgColor,
  cssStyleColor,
  cssStyleCustomIconColor,
  cssStyleSizeSizeHeight,
  cssStyleSizeWidth
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE } from "visual/utils/stateMode";
import {
  styleElementSwitcherSize,
  styleElementSwitcherSpacing
} from "visual/utils/style2";
import { Reader } from "visual/utils/types/Type";
import { CSSValue } from "../style2/types";

type IconPositionType = "left" | "top" | "bottom" | "right";

export const readIconPosition: Reader<IconPositionType> = (v) =>
  v === "top" || v === "left" || v === "bottom" || v === "right"
    ? v
    : undefined;

export function cssStyleElementSwitcherBtnIconPosition({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const iconPosition = dvv("iconPosition");
  switch (readIconPosition(iconPosition)) {
    case "left": {
      return "flex-direction: row;";
    }
    case "right": {
      return "flex-direction: row-reverse;";
    }
    case "top": {
      return "flex-direction: column;";
    }
    case "bottom": {
      return "flex-direction: column-reverse;";
    }
    case undefined:
      return "";
  }
}

export function cssStyleElementSwitcherBtnSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const iconPosition = dvv("iconPosition");
  const iconSpacing = dvv("iconSpacing");

  switch (readIconPosition(iconPosition)) {
    case "left": {
      return `margin: 0 ${iconSpacing}px 0 0;`;
    }
    case "right": {
      return `margin: 0 0 0 ${iconSpacing}px;`;
    }
    case "top": {
      return `margin: 0 0 ${iconSpacing}px 0;`;
    }
    case "bottom": {
      return `margin: ${iconSpacing}px 0 0 0;`;
    }
    case undefined:
      return "";
  }
}
export function cssStyleElementSwitcherNav2Width({
  v,
  device,
  state
}: CSSValue): string {
  const size = styleElementSwitcherSize({ v, device, state });
  return `width: ${size * 2}px;`;
}

export function cssStyleElementSwitcherNav2Height({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSizeSizeHeight({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "navStyle2"
  });
}

export function cssStyleElementSwitcherNavBeforeBg({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state: "active",
    getConfig,
    store,
    prefix: "bg"
  });
}

export function cssStyleElementSwitcherNavSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const spacing = styleElementSwitcherSpacing({ v, device, state });
  return `margin-bottom:${spacing}px;`;
}

export function cssStyleElementSwitcherActiveTextColor({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state: "active",
    getConfig,
    store,
    prefix: "color"
  });
}

export function cssStyleElementSwitcherActiveCustomIconColor({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleCustomIconColor({
    v,
    device,
    getConfig,
    state: ACTIVE,
    store
  });
}

export function cssStyleElementSwitcherWidth({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "navStyle1"
  });
}
