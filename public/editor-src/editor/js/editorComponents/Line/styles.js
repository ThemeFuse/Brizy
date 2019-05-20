import { renderStyles } from "visual/utils/cssStyle";

export function style(vs, v) {
  const styles = {
    ".brz &": ["cssStyleSizeWidthPercent"],
    ".brz & .brz-hr": ["cssStyleElementLineBorder"]
  };

  return [renderStyles({ vs, styles }), renderStyles({ vs, v, styles })];
}
