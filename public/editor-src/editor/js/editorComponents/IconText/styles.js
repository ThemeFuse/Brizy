import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": { standart: ["cssStyleElementIconBoxFlexDirection"] },

    ".brz &&:hover .brz-icon__container": {
      standart: [
        "cssStyleElementIconBoxMarginLeft",
        "cssStyleElementIconBoxMarginRight"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
