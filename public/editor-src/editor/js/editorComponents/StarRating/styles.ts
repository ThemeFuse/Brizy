import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz &&:hover .brz-starrating-text": {
      standart: [
        "cssStyleElementStarRatingTextSpacing",
        "cssStyleColor",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-starrating-icon-wrap": {
      standart: ["cssStyleSizeFontSizeIcon"]
    },
    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap:not(:last-child)":
      { standart: ["cssStyleElementStarRatingSpacing"] },
    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color-empty":
      {
        standart: ["cssStyleElementStarRatingRatingBackgroundColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color":
      {
        standart: ["cssStyleElementStarRatingRatingColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color .brz-icon-svg-custom":
      {
        standart: ["cssStyleElementStarRatingCustomIconColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz &&:hover .brz-starrating-style2-container": {
      standart: [
        "cssStyleColor",
        "cssStyleBgColor",
        "cssStyleBorderRadius",
        "cssStyleElementStarRatingDirection"
      ]
    },
    ".brz &&:hover .brz-starrating-style2-container .brz-icon-svg-custom": {
      standart: ["cssStyleCustomIconColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
