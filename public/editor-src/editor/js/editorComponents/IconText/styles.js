import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": { standart: ["cssStyleElementIconBoxFlexDirection"] },

    ".brz &&:hover .brz-icon__container": {
      standart: ["cssStyleElementIconBoxMargin", "cssStyleFlexVerticalAlign"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
