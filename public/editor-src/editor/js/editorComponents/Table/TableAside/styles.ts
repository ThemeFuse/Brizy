import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&.brz-table__th.brz-table__aside": {
      standart: ["cssStyleElementTableHeaderWidth"]
    }
  };

  return renderStyles({ ...data, styles });
}
