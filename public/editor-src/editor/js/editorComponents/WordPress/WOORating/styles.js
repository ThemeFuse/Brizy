import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz && > div > .brz-rating > .woocommerce-product-rating > .star-rating:hover": {
      standart: ["cssStyleElementWOORatingSize", "cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementStarRatingPropertyHoverTransition"
      ]
    },
    ".brz && > div > .brz-rating > .woocommerce-product-rating > .woocommerce-review-link:hover": {
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
