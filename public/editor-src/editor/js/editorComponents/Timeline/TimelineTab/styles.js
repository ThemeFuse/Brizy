import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz && .brz-timeline__nav--icon": {
      standart: ["cssStyleColor", "cssStyleBgColor"]
    },
    ".brz && .brz-timeline__content": {
      standart: ["cssStyleBgColor"]
    },
    ".brz && .brz-timeline__content:before": {
      standart: ["cssStyleBgColor"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
