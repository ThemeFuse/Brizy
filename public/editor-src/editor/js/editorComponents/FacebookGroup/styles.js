import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover:before": {
      standart: ["cssStyleBoxShadow", "cssStyleBorder"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionBoxShadow"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
