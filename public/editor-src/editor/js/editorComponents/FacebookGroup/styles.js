import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover:before": {
      standart: ["cssStyleBoxShadow", "cssStyleBorder"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookGroupPropertyHoverTransition"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
