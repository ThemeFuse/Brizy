import { defaultValueValue } from "../onChange";
import * as Num from "../reader/number";
import { CSSValue } from "../style2/types";

export function cssStyleElementShopifyQuantityLineHeight({
  v
}: CSSValue): string {
  const numLineHeight = Num.read(v.lineHeight);
  return numLineHeight === undefined ? "" : `line-height:${numLineHeight};`;
}

export function cssStyleElementShopifyQuantityInputWidth({
  v
}: CSSValue): string {
  const numWidth = Num.read(v.width);
  const widthSuffix = defaultValueValue({ v, key: "widthSuffix" });

  return numWidth === undefined ? "" : `width:${numWidth}${widthSuffix};`;
}
