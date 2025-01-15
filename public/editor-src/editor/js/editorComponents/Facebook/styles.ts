import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./toolbar";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&:hover.brz-fb-styles": {
      standart: [
        "cssStylePaddingBG",
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBoxShadow",
        "cssStyleBorder",
        "cssStyleElementFacebookWidth",
        "cssStyleElementFacebookAlign"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover.brz-fb-styles-button": {
      standart: [
        "cssStylePaddingBG",
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBoxShadow",
        "cssStyleElementFacebookAlign"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
