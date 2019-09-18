import { renderStyles } from "visual/utils/cssStyle";

export function styleBg(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleSizeWidthPercent",
        "cssStyleBorderRadius",
        "cssStyleBg2Color",
        "cssStyleBoxShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementProgressBarPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-progress-bar__wrapper": {
      standart: ["cssStyleBgColor", "cssStyleBorderRadius", "cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementProgressBarPropertyHoverTransition"
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
        "cssStyleElementProgressBarPadding",
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
