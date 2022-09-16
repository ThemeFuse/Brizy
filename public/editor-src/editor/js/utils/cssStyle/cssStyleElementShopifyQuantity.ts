import * as Num from "../reader/number";
import { CSSValue } from "../style2/types";

export function cssStyleElementShopifyQuantityLineHeight({
  v
}: CSSValue): string {
  const numLineHeight = Num.read(v.lineHeight);
  return numLineHeight === undefined ? "" : `line-height:${numLineHeight};`;
}
