import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./type";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeMaxWidth", "cssStyleElementForm2FlexBasisPercent"]
    },
    ".brz && .brz-textarea": {
      standart: ["cssStyleElementForm2InputHeight"]
    }
  };

  return renderStyles({ ...data, styles });
}
