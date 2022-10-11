import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./index";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz && .brz-timeline__nav--icon": {
      standart: ["cssStyleColor", "cssStyleBgColor", "cssStyleBorder"]
    },
    ".brz && .brz-timeline__content": {
      standart: ["cssStyleBgColor", "cssStyleBoxShadow", "cssStyleBorder"]
    },
    ".brz && .brz-timeline__content:before": {
      standart: ["cssStyleBgColor", "cssStyleBorder"]
    }
  };

  return renderStyles({ v, vs, vd, styles }) as [string, string, string];
}
