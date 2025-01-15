import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function styles(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleSizeWidth",
        "cssStyleBorderRadius",
        "cssStyleBorder",
        "cssStyleBoxShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&.brz-search-container--minimal .brz-search-form": {
      standart: ["cssStyleSizeHeightPxOnly"]
    },
    ".brz &&.brz-search-container--minimal:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz &&:hover .brz-btn, &&:hover .brz-search-form": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-search-form": {
      standart: ["cssStylePaddingBG"]
    },
    ".brz &&:hover .brz-search, &&:hover .brz-search::placeholder": {
      standart: [
        "cssStyleColor",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleElementSearchLineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-search-form .brz-search-icon__style1": {
      standart: ["cssStyleColor", "cssStyleTypography3FontSize"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-search:-webkit-autofill": {
      standart: ["cssStyleElementSearchAutocompleteColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };
  return renderStyles({ ...data, styles });
}
