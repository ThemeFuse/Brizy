import { renderStyles } from "visual/utils/cssStyle";

export function styleBg(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementProgressBarPropertyHoverTransition"
      ]
    },
    ".brz &&:hover.brz-progress-bar-style1": {
      standart: ["cssStyleBg2Color", "cssStyleBorderRadius"]
    },
    ".brz &&:hover.brz-progress-bar-style1::after": {
      standart: ["cssStyleBoxShadow", "cssStyleBorderRadius"]
    },
    ".brz &&:hover.brz-progress-bar-style2 .brz-progress-bar-overlay": {
      standart: ["cssStyleBg2Color", "cssStyleBorderRadius"]
    },
    ".brz &&:hover.brz-progress-bar-style2 .brz-progress-bar-overlay::after": {
      standart: ["cssStyleBoxShadow", "cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-progress-bar__wrapper": {
      standart: ["cssStyleBgColor", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementProgressBarPropertyHoverTransition"
      ]
    },
    ".brz &&:hover.brz-progress-bar-style2 .brz-progress-bar__percent": {
      standart: ["cssStyleBgColor", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementProgressBarPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-text__editor": {
      standart: [
        "cssStyleLabelColor",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing"
      ]
    },
    ".brz &&:hover .brz-progress-bar__percent": {
      standart: [
        "cssStyleColor",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}

export function styleBar(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleSizeProgressBarMaxWidthPercent",
        "cssStyleElementProgressBarPadding"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
