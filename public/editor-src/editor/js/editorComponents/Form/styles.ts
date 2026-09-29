import type { ElementModel } from "visual/component/Elements/Types";
import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleTextAlign"]
    }
  };

  return renderStyles({ ...data, styles });
}
