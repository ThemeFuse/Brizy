import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(v: ElementModel, vs: ElementModel, vd: ElementModel) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleTextAlign"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
