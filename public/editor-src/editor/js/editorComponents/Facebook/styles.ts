import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./toolbar";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
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

  return renderStyles({ v, vs, vd, styles });
}
