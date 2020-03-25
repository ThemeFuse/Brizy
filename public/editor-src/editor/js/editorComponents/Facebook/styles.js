import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover.brz-fb-styles": {
      standart: ["cssStyleBoxShadow", "cssStyleBorder"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookEmbedPropertyHoverTransition"
      ]
    },
    ".brz &&:hover.brz-fb-styles-button": {
      standart: ["cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookButtonPropertyHoverTransition"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
