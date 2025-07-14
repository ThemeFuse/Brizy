import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function styleChart(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleElementCounterChartEnd"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz && .brz-counter-chart, .brz && .brz-counter-figures": {
      standart: ["cssStylePaddingBG"]
    },
    ".brz &&:hover .brz-counter-figures": {
      standart: ["cssStyleColor", "cssStyleElementCounterTextShadow"]
    },
    ".brz && .brz-counter-chart-radial > svg > .brz-counter-pie-chart, .brz && .brz-counter-chart-empty > svg > .brz-counter-pie-chart":
      {
        standart: ["cssStyleElementCounterChartWidth"]
      },
    ".brz &&:hover .brz-counter-pie-chart": {
      standart: ["cssStyleStroke"]
    },
    ".brz &&:hover .brz-counter-radial-chart, .brz &&:hover .brz-counter-chart-pie":
      {
        standart: ["cssStyleFill"]
      },
    ".brz && .brz-counter-figures, .brz && .brz-counter-pie-chart, .brz && .brz-counter-radial-chart, .brz && .brz-counter-chart-pie":
      {
        standart: [
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
