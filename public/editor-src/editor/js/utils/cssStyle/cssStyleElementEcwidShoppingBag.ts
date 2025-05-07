import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleDisplayFlex,
  cssStyleDisplayNone,
  cssStylePositionLeft,
  cssStylePositionTop,
  cssStyleSizeIconSizes
} from "visual/utils/cssStyle/index";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";
import { checkValue } from "../checkValue";

type IconDisplay = "on" | "off";
const getIconDisplay = checkValue<IconDisplay>(["on", "off"]);

export function cssStyleElementEcwidShoppingBagIconBorderRadius({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "icon"
  });
}

export function cssStyleElementEcwidShoppingBagIconColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "iconColor"
  });
}

export function cssStyleElementEcwidShoppingBagIconBgColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "iconBg"
  });
}

export function cssStyleElementEcwidShoppingBagIconBorder({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, getConfig, store, prefix: "icon" });
}

export function cssStyleElementEcwidShoppingBagIconBoxShadow({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "icon"
  });
}

export function cssStyleElementEcwidShoppingBagIconBgGradient({
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
    prefix: "icon"
  });
}

export function cssStyleElementEcwidShoppingBagIconDisplay({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const iconDisplay = getIconDisplay(dvv("iconDisplay"));

  switch (iconDisplay) {
    case "on":
      return cssStyleDisplayFlex();
    case "off":
      return cssStyleDisplayNone();
    case undefined:
      return "";
  }
}

export function cssStyleElementEcwidShoppingBagIconSizes({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSizeIconSizes({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "icon"
  });
}

export function cssStyleElementEcwidShoppingBagIconPositionTop({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStylePositionTop({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "icon"
  });
}

export function cssStyleElementEcwidShoppingBagIconPositionLeft({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStylePositionLeft({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "icon"
  });
}
