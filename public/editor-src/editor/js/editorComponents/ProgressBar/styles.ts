import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";
import { DynamicStylesProps } from "visual/types";

export function styleBg(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover.brz-progress-bar-style1": {
      standart: [
        "cssStyleBg2Color",
        "cssStyleBorderRadius",
        "cssStyleSizeProgressBarStyle1Height"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover.brz-progress-bar-style1::after": {
      standart: ["cssStyleBoxShadow", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover.brz-progress-bar-style2 .brz-progress-bar-overlay": {
      standart: [
        "cssStyleBg2Color",
        "cssStyleBorderRadius",
        "cssStyleSizeProgressBarStyle2Height"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover.brz-progress-bar-style2 .brz-progress-bar-overlay::after": {
      standart: ["cssStyleBoxShadow", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-progress-bar__wrapper": {
      standart: ["cssStyleBgColor", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover.brz-progress-bar-style2 .brz-progress-bar__percent": {
      standart: ["cssStyleBgColor", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-progress-bar__text": {
      standart: [
        "cssStyleLabelColor",
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
    },
    ".brz &&:hover .brz-progress-bar__percent": {
      standart: [
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
    }
  };
  return renderStyles({ ...data, styles });
}

export function styleBar(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleSizeProgressBarMaxWidthPercent",
        "cssStyleElementProgressBarPadding"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
