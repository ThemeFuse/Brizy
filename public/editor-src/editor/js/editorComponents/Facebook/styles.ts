import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { Value } from "./toolbar";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&.brz-fb-styles": {
      standart: [
        "cssStylePaddingBG",
        "cssStyleElementFacebookWidth",
        "cssStyleElementFacebookAlign"
      ]
    },
    ".brz &&:hover.brz-fb-styles": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBoxShadow",
        "cssStyleBorder"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&.brz-fb-styles-button": {
      standart: ["cssStylePaddingBG", "cssStyleElementFacebookAlign"]
    },
    ".brz &&:hover.brz-fb-styles-button": {
      standart: ["cssStyleBgColor", "cssStyleBgGradient", "cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
