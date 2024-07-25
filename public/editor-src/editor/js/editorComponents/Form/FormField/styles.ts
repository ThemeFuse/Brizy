import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./type";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeMaxWidth", "cssStyleElementForm2FlexBasisPercent"]
    },
    ".brz && .brz-textarea": {
      standart: ["cssStyleElementForm2InputHeight"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
