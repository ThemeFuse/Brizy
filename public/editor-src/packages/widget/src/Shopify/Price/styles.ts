import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz && .brz-shopify-price-style1:hover": {
      standart: [
        "cssStyleElementShopifyBorderColorPrice",
        "cssStyleElementShopifyBoxShadowPrice",
        "cssStyleElementShopifyTextColorPrice",
        "cssStyleElementShopifyFontFamilyPrice",
        "cssStyleElementShopifyFontSizePrice",
        "cssStyleElementShopifyLineHeightPrice",
        "cssStyleElementShopifyFontWeightPrice",
        "cssStyleElementShopifyLetterSpacingPrice",
        "cssStyleElementShopifyBgColorPrice",
        "cssStyleElementShopifyPaddingFourFieldsPrice",
        "cssStyleElementShopifyMarginFourFieldsPrice"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-shopify-price-style2:hover": {
      standart: [
        "cssStyleElementShopifyBorderColorThroughPrice",
        "cssStyleElementShopifyBoxShadowThroughPrice",
        "cssStyleElementShopifyTextColorThroughPrice",
        "cssStyleElementShopifyFontFamilyThroughPrice",
        "cssStyleElementShopifyFontSizeThroughPrice",
        "cssStyleElementShopifyLineHeightThroughPrice",
        "cssStyleElementShopifyFontWeightThroughPrice",
        "cssStyleElementShopifyLetterSpacingThroughPrice",
        "cssStyleElementShopifyBgColorThroughPrice",
        "cssStyleElementShopifyPaddingFourFieldsThroughPrice",
        "cssStyleElementShopifyMarginFourFieldsThroughPrice"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
