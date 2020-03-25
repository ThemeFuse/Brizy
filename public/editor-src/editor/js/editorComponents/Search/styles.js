import { renderStyles } from "visual/utils/cssStyle";

export function styles(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleSizeWidthPercent",
        "cssStyleBorderRadius",
        "cssStyleBorder",
        "cssStyleBoxShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementSearchPropertyHoverTransition"
      ]
    },
    ".brz &&.brz-search-container__minimal": {
      standart: ["cssStyleSizeMinHeightPx"]
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
        "cssStyleElementSearchPropertyHoverTransition"
      ]
    },
    ".brz &&:hover > .brz-search-form > .brz-icon-svg": {
      standart: ["cssStyleColor", "cssStyleTypography3FontSize"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementSearchPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-search:-webkit-autofill": {
      standart: ["cssStyleElementSearchAutocompleteColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementSearchPropertyHoverTransition"
      ]
    }
  };
  return renderStyles({ v, vs, vd, styles });
}
