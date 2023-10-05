import { checkValue } from "visual/utils/checkValue";
import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";
import { cssStyleSpacing } from "visual/utils/cssStyle/cssStyleSpacing";
import { defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/reader/number";
import { capByPrefix } from "visual/utils/string";
import * as Str from "visual/utils/string/specs";
import { styleBgColor, styleBgGradient } from "visual/utils/style2";
import { CSSValue } from "../style2/types";
import { cssStyleColor } from "./cssStyleColor";

type Size = "small" | "medium" | "large" | "custom";
const getSize = checkValue<Size>(["small", "medium", "large", "custom"]);
export function cssStyleElementShopifyQuantityButtonSize({
  v,
  device,
  state,
  prefix = "button"
}: CSSValue): string {
  const { width, height } = cssStyleElementShopifyQuantitySize({
    v,
    device,
    state,
    prefix
  });

  return `min-width:${width}px; min-height:${height}px;`;
}

export function cssStyleElementShopifyQuantityInputSize({
  v,
  device,
  state,
  prefix = "input"
}: CSSValue): string {
  const { width, height } = cssStyleElementShopifyQuantitySize({
    v,
    device,
    state,
    prefix
  });

  return `width:${width}px; height:${height}px;`;
}

function cssStyleElementShopifyQuantitySize({
  v,
  device,
  prefix = ""
}: CSSValue): { width: number; height: number } {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const paddingWidth = Str.read(dvv(capByPrefix(prefix, "width")));
  const paddingHeight = Str.read(dvv(capByPrefix(prefix, "height")));
  const size = getSize(dvv(capByPrefix(prefix, "size")));

  const widths = {
    small: 40,
    medium: 60,
    large: 80,
    custom: paddingWidth
  };
  const heights = {
    small: 50,
    medium: 50,
    large: 50,
    custom: paddingHeight
  };

  const _width = size ? Num.read(widths[size]) ?? 0 : 0;
  const _height = size ? Num.read(heights[size]) ?? 0 : 0;

  return { width: _width, height: _height };
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
