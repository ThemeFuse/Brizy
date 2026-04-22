import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&.brz-fb-styles": {
      standart: [
        "cssStylePaddingBG",
        "cssStyleElementFacebookWidth",
        "cssStyleElementFacebookAlign"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover.brz-fb-styles": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBoxShadow",
        "cssStyleBorder"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
