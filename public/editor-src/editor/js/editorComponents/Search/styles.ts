import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function styles(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth", "cssStyleBorderRadius"]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBorder",
        "cssStyleBoxShadow"
      ]
    },
    ".brz &&.brz-search-container--minimal .brz-search-form": {
      standart: ["cssStyleSizeHeightPxOnly"]
    },
    ".brz &&.brz-search-container--minimal:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz && .brz-btn, && .brz-search-form": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz && .brz-search-form": {
      standart: ["cssStylePaddingBG"]
    },
    ".brz && .brz-search, &&:hover .brz-search::placeholder": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleElementSearchLineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform"
      ]
    },
    ".brz &&:hover .brz-search, &&:hover .brz-search::placeholder": {
      standart: ["cssStyleColor"]
    },
    ".brz && .brz-search-form .brz-search-icon__style1": {
      standart: ["cssStyleTypography3FontSize"]
    },
    ".brz &&:hover .brz-search-form .brz-search-icon__style1": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .brz-search:-webkit-autofill": {
      standart: ["cssStyleElementSearchAutocompleteColor"]
    },
    ".brz &&, .brz && .brz-search, && .brz-search::placeholder, .brz && .brz-search-form .brz-search-icon__style1, .brz && .brz-search:-webkit-autofill":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };
  return renderStyles({ ...data, styles });
}
