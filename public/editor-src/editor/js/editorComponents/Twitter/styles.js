import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&.brz-customSize:hover": {
      standart: ["cssStyleSizeWidthPercent", "cssStyleSizeHeightPx"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
