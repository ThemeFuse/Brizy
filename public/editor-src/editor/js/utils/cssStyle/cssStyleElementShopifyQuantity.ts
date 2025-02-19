import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";
import {
  cssStyleSizeHeight,
  cssStyleSizeWidth
} from "visual/utils/cssStyle/cssStyleSize";
import { cssStyleSpacing } from "visual/utils/cssStyle/cssStyleSpacing";
import { defaultValueValue } from "visual/utils/onChange";
import * as Str from "visual/utils/reader/string";
import { capByPrefix } from "visual/utils/string";
import { styleBgColor, styleBgGradient } from "visual/utils/style2";
import { CSSValue } from "../style2/types";
import { cssStyleColor } from "./cssStyleColor";

export function cssStyleElementShopifyQuantityButtonWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "button" });
}

export function cssStyleElementShopifyQuantityInputWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "input" });
}

export function cssStyleElementShopifyQuantityButtonHeight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, store, prefix: "button" });
}

export function cssStyleElementShopifyQuantityInputHeight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, store, prefix: "input" });
}

export function cssStyleElementShopifyQuantityButtonSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "button",
    direction: "horizontal"
  });
}

export function cssStyleElementShopifyQuantityButtonBgColor({
  v,
  device,
  state,
  store,
  prefix = "bgButton"
}: CSSValue): string {
  const bgColor = styleBgColor({ v, device, state, store, prefix });

  const bgGradient = styleBgGradient({
    v,
    device,
    state,
    store
  });

  return bgColor === undefined || bgGradient !== "none"
    ? "background-color:transparent;"
    : `background-color:${bgColor};`;
}

export function cssStyleElementShopifyQuantityInputBgColor({
  v,
  device,
  state,
  store,
  prefix = "bgInput"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyQuantityButtonBorder({
  v,
  device,
  state,
  store,
  prefix = "button"
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix });
}
export function cssStyleElementShopifyQuantityInputBorder({
  v,
  device,
  state,
  store,
  prefix = "input"
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix });
}

export function cssStyleElementShopifyQuantityButtonBoxShadow({
  v,
  device,
  state,
  store,
  prefix = "button"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyQuantityInputBoxShadow({
  v,
  device,
  state,
  store,
  prefix = "input"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyQuantityButtonRadius({
  v,
  device,
  state,
  store,
  prefix = "quantityButton"
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyQuantityInputRadius({
  v,
  device,
  state,
  store,
  prefix = "quantityInput"
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix });
}

export const cssStyleElementShopifyQuantityIconColor = ({
  v,
  device,
  state,
  store
}: CSSValue): string => {
  return cssStyleColor({ v, device, state, store, prefix: "buttonIconColor" });
};

export function cssStyleElementShopifyQuantityIconSize({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const customSize = dvv(capByPrefix(prefix, "iconCustomSize"));
  const customSizeSuffix = Str.read(
    dvv(capByPrefix(prefix, "iconCustomSizeSuffix"))
  );
  return `font-size:${customSize}${customSizeSuffix ?? "px"};`;
}
