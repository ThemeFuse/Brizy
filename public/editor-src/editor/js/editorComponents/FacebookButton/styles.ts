import { renderStyles } from "visual/utils/cssStyle";
import { ElementModel } from "visual/component/Elements/Types";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionBoxShadow"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
