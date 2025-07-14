import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz && .brz-paypal-form": {
      standart: ["cssStyleFlexHorizontalAlign"]
    },
    ".brz && .brz-paypal-text": {
      standart: ["getAllCssStyleTypography"]
    },
    ".brz && .brz-paypal-button": {
      standart: [
        "cssStyleElementPaypalIconPosition",
        "cssStyleBorderRadius",
        "cssStyleSizeWidth",
        "cssStyleSizeHeight",
        "cssStyleHoverTransition"
      ]
    },
    ".brz &&:hover .brz-paypal-button": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBoxShadow",
        "cssStyleBgGradient",

        "cssStyleColor"
      ]
    },
    ".brz && .brz-paypal-icon": {
      standart: ["cssStyleSizeFontSizeIcon", "cssStyleElementPaypalBtnSpacing"]
    }
  };

  return renderStyles({ ...data, styles });
}
