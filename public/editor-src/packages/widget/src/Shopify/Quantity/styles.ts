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
    ".brz &&:hover ": {
      standart: ["cssStylePaddingFourFields"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-shopify-quantity-style2 input:hover": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleColor",
        "cssStyleElementShopifyQuantityButtonSpacingLeft",
        "cssStyleElementShopifyQuantityButtonSpacingRight",
        "cssStyleElementShopifyQuantityInputBgColor",
        "cssStyleElementShopifyQuantityInputBorder",
        "cssStyleElementShopifyQuantityInputBoxShadow",
        "cssStyleElementShopifyQuantityInputSize",
        "cssStyleSizeHeightPxOnly",
        "cssStyleSizeWidth",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleElementShopifyQuantityInputRadius"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-shopify-quantity-style1 input:hover": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleColor",
        "cssStyleElementShopifyQuantityButtonSpacingLeft",
        "cssStyleElementShopifyQuantityButtonSpacingRight",
        "cssStyleElementShopifyQuantityInputBgColor",
        "cssStyleElementShopifyQuantityInputBorder",
        "cssStyleElementShopifyQuantityInputBoxShadow",
        "cssStyleElementShopifyQuantityInputSize",
        "cssStyleSizeHeightPxOnly",
        "cssStyleSizeWidth",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleElementShopifyQuantityInputRadius"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-shopify-quantity-style2 .brz-package__button:hover": {
      standart: [
        "cssStyleElementShopifyQuantityButtonRadius",
        "cssStyleElementShopifyQuantityButtonBgColor",
        "cssStyleElementShopifyQuantityButtonBorder",
        "cssStyleElementShopifyQuantityButtonBoxShadow",
        "cssStyleElementShopifyQuantityButtonSize",
        "cssStyleSizeHeightPxOnly",
        "cssStyleSizeWidth"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-shopify-quantity-container": {
      standart: ["cssStylePaddingBG"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
