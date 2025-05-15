import { ElementModel } from "visual/component/Elements/Types";
import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&": { standart: ["cssStyleElementIconBoxFlexDirection"] },
    ".brz && .brz-icon__container": {
      standart: ["cssStyleElementIconBoxMargin", "cssStyleFlexVerticalAlign"]
    }
  };

  return renderStyles({ ...data, styles });
}
