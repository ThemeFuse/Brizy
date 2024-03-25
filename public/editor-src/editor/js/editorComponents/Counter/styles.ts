import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function styleChart(v: Value, vs: Value, vd: Value): OutputStyle {
  const styles: Styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementCounterChartEnd"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function style(v: Value, vs: Value, vd: Value): OutputStyle {
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

  return renderStyles({ v, vs, vd, styles });
}

export function styleNumber(v: Value, vs: Value, vd: Value): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing",
        "cssStyleTypography2FontVariation"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
