import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz && .star-rating:hover": {
      standart: ["cssStyleElementWOORatingSize", "cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementStarRatingPropertyHoverTransition"
      ]
    },
    ".brz && .star-rating:hover:before": {
      standart: ["cssStyleElementWOORatingBgStarColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementStarRatingPropertyHoverTransition"
      ]
    },
    ".brz && .woocommerce-review-link:hover": {
      standart: [
        "cssStyleElementWOORatingSpacing",
        "cssStyleElementWOORatingTextColor",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementStarRatingPropertyHoverTransition"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
