import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function styleContent(data: DynamicStylesProps<ElementModel>): OutputStyle {
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
  return renderStyles({ ...data, styles });
}
