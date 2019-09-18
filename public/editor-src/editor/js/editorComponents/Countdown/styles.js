import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleSizeWidthPercent",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ]
    },

    ".brz &&:hover .brz-countdown__label": {
      standart: ["cssStyleTypographyElementCountdownLabelFontSize"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
