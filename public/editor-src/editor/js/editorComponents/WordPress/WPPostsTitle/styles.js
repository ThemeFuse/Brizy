import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleContentAlign"
      ]
    },
    ".brz &&:hover > .brz-a": {
      standart: ["cssStyleColor"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
