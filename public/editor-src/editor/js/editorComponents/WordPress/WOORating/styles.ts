import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz && .star-rating": {
      standart: ["cssStyleElementWOORatingSize"]
    },
    ".brz && .star-rating:hover": {
      standart: ["cssStyleColor"]
    },
    ".brz && .star-rating:hover:before": {
      standart: ["cssStyleElementWOORatingBgStarColor"]
    },
    ".brz && .woocommerce-review-link": {
      standart: [
        "cssStyleElementWOORatingSpacing",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform"
      ]
    },
    ".brz && .woocommerce-review-link:hover": {
      standart: ["cssStyleElementWOORatingTextColor"]
    },
    ".brz && .star-rating, .brz && .star-rating:before, .brz && .woocommerce-review-link":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
