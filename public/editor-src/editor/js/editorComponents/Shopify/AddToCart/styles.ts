import { renderStyles } from "visual/utils/cssStyle";
import { Value } from ".";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleElementButtonBgColor",
        "cssStyleBgGradient",
        "cssStyleBoxShadow",
        "cssStyleBorder",
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
