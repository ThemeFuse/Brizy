import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function styleBg(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz &&.brz-progress-bar-style1": {
      standart: ["cssStyleBorderRadius", "cssStyleSizeProgressBarStyle1Height"]
    },
    ".brz &&:hover.brz-progress-bar-style1": {
      standart: ["cssStyleBg2Color"]
    },
    ".brz &&.brz-progress-bar-style1::after": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover.brz-progress-bar-style1::after": {
      standart: ["cssStyleBoxShadow"]
    },
    ".brz &&.brz-progress-bar-style2 .brz-progress-bar-overlay": {
      standart: ["cssStyleBorderRadius", "cssStyleSizeProgressBarStyle2Height"]
    },
    ".brz &&:hover.brz-progress-bar-style2 .brz-progress-bar-overlay": {
      standart: ["cssStyleBg2Color"]
    },
    ".brz &&.brz-progress-bar-style2 .brz-progress-bar-overlay::after": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover.brz-progress-bar-style2 .brz-progress-bar-overlay::after": {
      standart: ["cssStyleBoxShadow"]
    },
    ".brz && .brz-progress-bar__wrapper": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-progress-bar__wrapper": {
      standart: ["cssStyleBgColor"]
    },
    ".brz &&.brz-progress-bar-style2 .brz-progress-bar__percent": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover.brz-progress-bar-style2 .brz-progress-bar__percent": {
      standart: ["cssStyleBgColor"]
    },
    ".brz && .brz-progress-bar__text": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform"
      ]
    },
    ".brz &&:hover .brz-progress-bar__text": {
      standart: ["cssStyleLabelColor"]
    },
    ".brz && .brz-progress-bar__percent": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    },
    ".brz &&:hover .brz-progress-bar__percent": {
      standart: ["cssStyleColor"]
    },
    ".brz && .brz-progress-bar__percent, .brz && .brz-progress-bar__text, .brz &&.brz-progress-bar-style2 .brz-progress-bar__percent, .brz && .brz-progress-bar__wrapper, .brz &&.brz-progress-bar-style1, .brz &&.brz-progress-bar-style1::after, .brz &&.brz-progress-bar-style2 .brz-progress-bar-overlay, .brz &&.brz-progress-bar-style2 .brz-progress-bar-overlay::after":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };
  return renderStyles({ ...data, styles });
}

export function styleBar(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleSizeProgressBarMaxWidthPercent",
        "cssStyleElementProgressBarPadding"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
