import { renderStyles } from "visual/utils/cssStyle";

export function styleChart(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleElementCounterChartEnd"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidth"]
    },
    ".brz &&:hover .brz-counter-figures": {
      standart: ["cssStyleColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementCounterTransitionHoverProperty"
      ]
    },
    ".brz &&:hover .brz-counter-chart-radial > svg > .brz-counter-pie-chart": {
      standart: ["cssStyleElementCounterChartWidth"]
    },
    ".brz &&:hover .brz-counter-chart-empty > svg > .brz-counter-pie-chart": {
      standart: ["cssStyleElementCounterChartWidth"]
    },
    ".brz &&:hover .brz-counter-pie-chart": {
      standart: ["cssStyleElementCounterStrokeColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementCounterTransitionHoverProperty"
      ]
    },
    ".brz &&:hover .brz-counter-radial-chart": {
      standart: ["cssStyleElementCounterFillColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementCounterTransitionHoverProperty"
      ]
    },
    ".brz &&:hover .brz-counter-chart-pie": {
      standart: ["cssStyleElementCounterFillColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementCounterTransitionHoverProperty"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleNumber(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
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
