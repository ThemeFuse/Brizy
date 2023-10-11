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
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "button" });
}

export function cssStyleElementShopifyQuantityInputWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "input" });
}

export function cssStyleElementShopifyQuantityButtonHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, prefix: "button" });
}

export function cssStyleElementShopifyQuantityInputHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, prefix: "input" });
}

export function cssStyleElementShopifyQuantityButtonSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "button",
    direction: "horizontal"
  });
}

export function cssStyleElementShopifyQuantityButtonBgColor({
  v,
  device,
  state,
  prefix = "bgButton"
}: CSSValue): string {
  const bgColor = styleBgColor({ v, device, state, prefix });

  const bgGradient = styleBgGradient({
    v,
    device,
    state
  });

  return bgColor === undefined || bgGradient !== "none"
    ? "background-color:transparent;"
    : `background-color:${bgColor};`;
}

export function cssStyleElementShopifyQuantityInputBgColor({
  v,
  device,
  state,
  prefix = "bgInput"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyQuantityButtonBorder({
  v,
  device,
  state,
  prefix = "button"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix });
}
export function cssStyleElementShopifyQuantityInputBorder({
  v,
  device,
  state,
  prefix = "input"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix });
}

export function cssStyleElementShopifyQuantityButtonBoxShadow({
  v,
  device,
  state,
  prefix = "button"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix });
}

export function cssStyleElementShopifyQuantityInputBoxShadow({
  v,
  device,
  state,
  prefix = "input"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix });
}

export function cssStyleElementShopifyQuantityButtonRadius({
  v,
  device,
  state,
  prefix = "quantityButton"
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix });
}

export function cssStyleElementShopifyQuantityInputRadius({
  v,
  device,
  state,
  prefix = "quantityInput"
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix });
}

export const cssStyleElementShopifyQuantityIconColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({ v, device, state, prefix: "buttonIconColor" });
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
