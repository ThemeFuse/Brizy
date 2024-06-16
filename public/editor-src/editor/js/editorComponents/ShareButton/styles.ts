import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";

export function styleItem(v: Value, vs: Value, vd: Value): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleElementShareButtonGrid",
        "cssStyleElementShareButtonColumns"
      ]
    },
    ".brz && .brz-shareButton__icon-only .brz-shareButton__item-icon": {
      standart: ["cssStyleElementShareButtonColumnsIcon"]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
