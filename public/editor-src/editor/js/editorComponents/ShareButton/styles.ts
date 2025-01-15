import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types";
import { DynamicStylesProps } from "visual/types";

export function styleItem(data: DynamicStylesProps<Value>): OutputStyle {
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
  return renderStyles({ ...data, styles });
}
