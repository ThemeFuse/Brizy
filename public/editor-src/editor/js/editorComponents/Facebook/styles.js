import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover.brz-fb-styles": {
      standart: ["cssStyleBoxShadow", "cssStyleBorder"],
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
