import { renderStyles } from "visual/utils/cssStyle";
import { DynamicStylesProps } from "visual/types";
import { ElementModel } from "visual/component/Elements/Types";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeMaxWidth", "cssStyleElementForm2FlexBasisPercent"]
    }
  };

  return renderStyles({ ...data, styles });
}
