import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ]
    },
    ".brz && .brz-wp__postinfo .brz-li:hover": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .brz-wp__postinfo .brz-li": {
      standart: ["cssStyleElementPostInfoSpacing"]
    },
    ".brz &&:hover .brz-wp__postinfo .brz-icon-svg": {
      standart: ["cssStyleElementPostInfoColorIcons"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
