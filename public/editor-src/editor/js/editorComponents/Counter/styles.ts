import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";
import { DynamicStylesProps } from "visual/types";

export function styleChart(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementCounterChartEnd"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz && .brz-counter-chart": {
      standart: ["cssStylePaddingBG"]
    },
    ".brz &&:hover .brz-counter-figures": {
      standart: [
        "cssStyleColor",
        "cssStyleElementCounterTextShadow",
        "cssStylePaddingBG"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionFill"
      ]
    },
    ".brz &&:hover .brz-counter-chart-radial > svg > .brz-counter-pie-chart": {
      standart: ["cssStyleElementCounterChartWidth"]
    },
    ".brz &&:hover .brz-counter-chart-empty > svg > .brz-counter-pie-chart": {
      standart: ["cssStyleElementCounterChartWidth"]
    },
    ".brz &&:hover .brz-counter-pie-chart": {
      standart: ["cssStyleStroke"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionFill"
      ]
    },
    ".brz &&:hover .brz-counter-radial-chart": {
      standart: ["cssStyleFill"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionFill"
      ]
    },
    ".brz &&:hover .brz-counter-chart-pie": {
      standart: ["cssStyleFill"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionFill"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleNumber(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
