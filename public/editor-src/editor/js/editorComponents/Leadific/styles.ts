import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleFlexHorizontalAlign"]
    },
    ".brz && .brz-leadific__content": {
      standart: ["getAllCssStyleTypography", "cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-leadific__content": {
      standart: ["cssStyleColor", "cssStyleStrokeText", "cssStyleTextShadow2"]
    }
  };

  return renderStyles({ ...data, styles });
}
