import { renderStyles } from "visual/utils/cssStyle";
import { ElementModel } from "visual/component/Elements/Types";
import { OutputStyle } from "visual/utils/cssStyle/types";
import type { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover": { standart: ["cssStyleElementIconBoxFlexDirection"] },

    ".brz &&:hover .brz-icon__container": {
      standart: ["cssStyleElementIconBoxMargin", "cssStyleFlexVerticalAlign"]
    }
  };

  return renderStyles({ ...data, styles });
}
