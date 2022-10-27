import { cssStyleBorder, cssStyleBorderRadius, cssStyleColor } from ".";
import { styleSizeHeight, styleSizeWidth } from "../style2/styleSize";
import { CSSValue } from "../style2/types";

export function cssStyleElementShopifyAddToCartSize({
  v,
  device,
  state
}: CSSValue): string {
  const width = styleSizeWidth({ v, device, state });
  const height = styleSizeHeight({ v, device, state });

  return width === undefined || height === undefined
    ? ""
    : `padding: ${height}px ${width}px;`;
}

export function cssStyleElementShopifyAddToCartBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state });
}

export function cssStyleElementShopifyAddToCartBorderBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, prefix: "button", state });
}

export function cssStyleElementShopifyAddToCartButtonColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "buttonColor" });
}
