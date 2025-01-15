
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle } from "visual/utils/cssStyle/types";
import type { Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";
import { DynamicStylesProps } from "visual/types";

export function style(data:DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth", "cssStyleBoxShadow"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTOCPropertyHoverTransition"
      ]
    },
    ".brz && .brz-toc-header:hover": {
      standart: [
        "cssStyleElementTOCHeaderBgColor",
        "cssStyleElementTOCHeaderBorder",
        "cssStyleElementTOCHeaderPadding"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTOCPropertyHoverTransition"
      ]
    },
    ".brz && .brz-toc-header:hover .brz-toc-title": {
      standart: [
        "cssStyleElementTOCTitleColor",
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
        "cssStyleElementTOCPropertyHoverTransition"
      ]
    },
    ".brz && .brz-toc-body__list:hover": {
      standart: [
        "cssStyleElementTOCBodyBgColor",
        "cssStyleElementTOCBodyFontFamily",
        "cssStyleElementTOCBodyFontSize",
        "cssStyleElementTOCBodyLineHeight",
        "cssStyleElementTOCBodyFontWeight",
        "cssStyleElementTOCBodyLetterSpacing",
        "cssStyleElementTOCBodyFontVariation",
        "cssStyleElementTOCBodyTextTransform",
        "cssStyleElementTOCWordWrap"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTOCPropertyHoverTransition"
      ]
    },
    ".brz && .brz-toc-body__list .brz-li:hover": {
      standart: ["cssStyleElementTOCBodyColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTOCPropertyHoverTransition"
      ]
    },
    ".brz &&.brz-toc--opened .brz-toc-body:hover": {
      standart: ["cssStyleElementTOCBodyBorder"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTOCPropertyHoverTransition"
      ]
    },
    ".brz && .brz-toc-body__list, .brz && .brz-toc-message": {
      standart: ["cssStyleElementTOCBodyPadding"]
    },
    ".brz && .brz-toc-body li:hover .brz-toc-body__list-marker": {
      standart: [
        "cssStyleElementTOCBodyMarkerSize",
        "cssStyleElementTOCBodyMarkerColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTOCPropertyHoverTransition"
      ]
    },
    ".brz && .brz-toc-body li:hover::marker": {
      standart: [
        "cssStyleElementTOCBodyMarkerSize",
        "cssStyleElementTOCBodyMarkerColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTOCPropertyHoverTransition"
      ]
    },
    ".brz && .brz-toc-header:hover .brz-toc-icon-wrapper": {
      standart: ["cssStyleElementTOCTitleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementTOCPropertyHoverTransition"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
