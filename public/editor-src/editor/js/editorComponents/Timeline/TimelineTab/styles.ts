import type { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";
import type { Value } from "./index";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz && .brz-timeline__nav--icon": {
      standart: ["cssStyleColor", "cssStyleBgColor", "cssStyleBorder"]
    },
    ".brz && .brz-timeline__nav--icon .brz-icon-svg-custom": {
      standart: ["cssStyleCustomIconColor"]
    },
    ".brz && .brz-timeline__content": {
      standart: ["cssStyleBgColor", "cssStyleBoxShadow", "cssStyleBorder"]
    },
    ".brz && .brz-timeline__content:before": {
      standart: ["cssStyleBgColor", "cssStyleBorder"]
    }
  };

  return renderStyles({ ...data, styles });
}
