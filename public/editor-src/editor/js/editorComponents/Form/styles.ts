import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleTextAlign"]
    }
  };

  return renderStyles({ ...data, styles });
}
