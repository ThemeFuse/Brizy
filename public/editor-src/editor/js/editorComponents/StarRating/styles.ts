import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { Styles } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles: Styles = {
    ".brz && .brz-starrating-text": {
      standart: [
        "cssStyleElementStarRatingTextSpacing",
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    },
    ".brz &&:hover .brz-starrating-text": {
      standart: ["cssStyleColor"]
    },
    ".brz && .brz-starrating-icon-wrap": {
      standart: ["cssStyleSizeFontSizeIcon"]
    },
    ".brz && .brz-starrating-container .brz-starrating-icon-wrap:not(:last-child)":
      { standart: ["cssStyleElementStarRatingSpacing"] },
    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color-empty":
      {
        standart: ["cssStyleElementStarRatingRatingBackgroundColor"]
      },
    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color":
      {
        standart: ["cssStyleElementStarRatingRatingColor"]
      },
    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color .brz-icon-svg-custom":
      {
        standart: ["cssStyleElementStarRatingCustomIconColor"]
      },
    ".brz &&:hover .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color-empty.brz-icon-svg-custom":
      {
        standart: ["cssStyleElementStarRatingCustomIconBackgroundColor"]
      },
    ".brz && .brz-starrating-style2-container": {
      standart: ["cssStyleBorderRadius", "cssStyleElementStarRatingDirection"]
    },
    ".brz &&:hover .brz-starrating-style2-container": {
      standart: ["cssStyleColor", "cssStyleBgColor"]
    },
    ".brz &&:hover .brz-starrating-style2-container .brz-icon-svg-custom": {
      standart: ["cssStyleCustomIconColor"]
    },
    ".brz && .brz-starrating-style2-container .brz-icon-svg-custom, .brz && .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color .brz-icon-svg-custom, .brz && .brz-starrating-text, .brz && .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color-empty, .brz && .brz-starrating-container .brz-starrating-icon-wrap .brz-starrating-color":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
