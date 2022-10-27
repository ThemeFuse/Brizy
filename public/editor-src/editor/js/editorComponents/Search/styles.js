import { renderStyles } from "visual/utils/cssStyle";

export function styles(v, vs, vd) {
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
    ".brz &&.brz-search-container--minimal": {
      standart: ["cssStyleSizeHeightPxOnly"]
    },
    ".brz &&.brz-search-container--minimal:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz &&:hover .brz-btn, &&:hover .brz-search-form": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-search, &&:hover .brz-search::placeholder": {
      standart: [
        "cssStyleColor",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleElementSearchLineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing"
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
  return renderStyles({ v, vs, vd, styles });
}
