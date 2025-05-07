import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function styleContent(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles: Styles = {
    ".brz &&, .brz && .brz-video-content, .brz && .brz-shortcode__placeholder":
      {
        standart: ["cssStyleBorderRadius"]
      },
    ".brz &&:before": {
      standart: ["cssStyleBorderRadius"]
    }
  };
  return renderStyles({ ...data, styles });
}
