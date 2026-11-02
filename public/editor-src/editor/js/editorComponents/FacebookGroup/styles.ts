import type { ElementModel } from "visual/component/Elements/Types";
import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover:before": {
      standart: [
        "cssStyleBoxShadow",
        "cssStyleBorder",
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionBoxShadow"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
