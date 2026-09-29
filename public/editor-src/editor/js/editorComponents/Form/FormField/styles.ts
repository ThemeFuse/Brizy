import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";
import type { Value } from "./type";

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
