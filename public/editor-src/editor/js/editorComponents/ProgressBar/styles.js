import { renderStyles } from "visual/utils/cssStyle";

export function styleBg(vs, v) {
  const styles = {
    ".brz &": [
      "cssStyleSizeWidthPercent",
      "cssStyleBorderRadiusGrouped",
      "cssStyleBg2Color"
    ]
  };

  return [renderStyles({ vs, styles }), renderStyles({ vs, v, styles })];
}

export function styleBar(vs, v) {
  const styles = {
    ".brz &": [
      "cssStyleSizeMaxWidthPercent",
      "cssStyleElementProgressBarPadding",
      "cssStyleBorderRadiusGrouped",
      "cssStyleTypographyFontFamily",
      "cssStyleTypographyFontSize",
      "cssStyleTypographyLineHeight",
      "cssStyleTypographyFontWeight",
      "cssStyleTypographyLetterSpacing",
      "cssStyleColor",
      "cssStyleBgColor"
    ]
  };

  return [renderStyles({ vs, styles }), renderStyles({ vs, v, styles })];
}
