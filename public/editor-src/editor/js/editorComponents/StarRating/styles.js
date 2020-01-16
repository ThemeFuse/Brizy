import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover .brz-starrating-text": {
      standart: [
        "cssStyleSizeSpacing",
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

    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap": {
      standart: ["cssStyleIconSpacing", "cssStyleIconSize"]
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
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
