import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

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
