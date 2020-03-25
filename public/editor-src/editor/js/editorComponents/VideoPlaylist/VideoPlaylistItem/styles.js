import { renderStyles } from "visual/utils/cssStyle";

export function styleContent(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBorderRadius", "cssStyleElementVideoBgColorRatio"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-video-content, && .brz-shortcode__placeholder": {
      standart: ["cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementVideoPropertyHoverTransition"
      ]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
