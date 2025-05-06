import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth", "cssStyleSizeMinHeightPx"]
    },
    ".brz &&:before, .brz && .brz-soundCloud-content": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBorder", "cssStyleBoxShadow"]
    },
    ".brz && iframe": { standart: ["cssStyleSizeHeight"] },
    ".brz &&:before": {
      standart: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
