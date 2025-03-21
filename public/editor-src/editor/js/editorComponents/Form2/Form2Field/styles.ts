import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./type";

export function style(data: DynamicStylesProps<Value>) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeMaxWidth", "cssStyleElementForm2FlexBasisPercent"]
    },
    ".brz && .brz-textarea": {
      standart: ["cssStyleElementForm2InputHeight"]
    },
    ".brz && .brz-forms2__checkbox-option, .brz && .brz-forms2__radio-option": {
      standart: ["cssStyleElementForm2FieldColumns"]
    }
  };

  return renderStyles({ ...data, styles });
}
