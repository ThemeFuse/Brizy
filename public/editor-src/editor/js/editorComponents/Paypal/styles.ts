import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function style(v: Value, vs: Value, vd: Value): OutputStyle {
  const styles: Styles = {
    ".brz && .brz-paypal-form": {
      standart: ["cssStyleFlexHorizontalAlign"]
    },
    ".brz && .brz-paypal-text": {
      standart: ["getAllCssStyleTypography"]
    },
    ".brz &&:hover .brz-paypal-button": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStyleBorderRadius",
        "cssStyleBoxShadow",
        "cssStyleElementPaypalIconPosition",
        "cssStyleBgGradient",
        "cssStyleSizeWidth",
        "cssStyleSizeHeight",
        "cssStyleColor"
      ],
      interval: ["cssStyleHoverTransition"]
    },

    ".brz && .brz-paypal-icon": {
      standart: ["cssStyleSizeFontSizeIcon", "cssStyleElementPaypalBtnSpacing"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
