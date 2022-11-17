import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";

export function styleChart(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementCounterChartEnd"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function style(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
  const styles = {
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

export function styleNumber(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypography2FontSize",
        "cssStyleTypography2LineHeight",
        "cssStyleTypography2FontWeight",
        "cssStyleTypography2LetterSpacing"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
