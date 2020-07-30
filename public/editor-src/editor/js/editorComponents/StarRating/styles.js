import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-starrating-text": {
      standart: [
        "cssStyleElementStarRatingTextSpacing",
        "cssStyleColor",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementStarRatingPropertyHoverTransition"
      ]
    },

    ".brz &&:hover .brz-starrating-icon-wrap": {
      standart: ["cssStyleIconSize"]
    },

    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap:not(:last-child)": {
      standart: ["cssStyleIconSpacing"]
    },

    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color-empty": {
      standart: ["cssStyleElementStarRatingRatingBackgroundColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementStarRatingPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color": {
      standart: ["cssStyleElementStarRatingRatingColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementStarRatingPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-starrating-style2-container": {
      standart: [
        "cssStyleColor",
        "cssStyleElementStarRatingStyle2Background",
        "cssStyleElementStarRatingStyle2BorderRadius",
        "cssStyleElementStarRatingDirection"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
