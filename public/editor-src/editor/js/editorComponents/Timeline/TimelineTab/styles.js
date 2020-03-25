import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz && .brz-timeline__nav--icon": {
      standart: ["cssStyleColor", "cssStyleBgColor", "cssStyleBorder"]
    },
    ".brz && .brz-timeline__content": {
      standart: ["cssStyleBgColor", "cssStyleBoxShadow", "cssStyleBorder"]
    },
    ".brz && .brz-timeline__content:before": {
      standart: ["cssStyleBgColor", "cssStyleElementTimelineArrowBorder"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
