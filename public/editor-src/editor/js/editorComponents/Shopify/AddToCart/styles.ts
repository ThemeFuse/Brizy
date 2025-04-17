import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { Value } from ".";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleBorderRadiusType",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleElementShopifyAddToCartSize",
        "cssStyleElementButtonIconPosition"
      ]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleElementButtonBgColor",
        "cssStyleBgGradient",
        "cssStyleBoxShadow",
        "cssStyleBorder"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-icon-svg-custom:hover": {
      standart: ["cssStyleCustomIconColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-shopify-icon-cart": {
      standart: [
        "cssStyleSizeFontSizeIcon",
        "cssStyleElementButtonIconMargin",
        "cssStyleElementButtonIconStrokeWidth"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
