import { renderStyles } from "visual/utils/cssStyle";

export function styleContent(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionTransform"
      ]
    },
    ".brz &&:before": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz && .brz-video-content && .brz-shortcode__placeholder": {
      standart: ["cssStyleBorderRadius"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
