import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz && .star-rating:hover": {
      standart: ["cssStyleElementWOORatingSize", "cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .star-rating:hover:before": {
      standart: ["cssStyleElementWOORatingBgStarColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
