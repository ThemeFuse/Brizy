import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function styleContent(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): OutputStyle {
  const styles: Styles = {
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
