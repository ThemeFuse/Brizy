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
      standart: ["cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionBoxShadow"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
