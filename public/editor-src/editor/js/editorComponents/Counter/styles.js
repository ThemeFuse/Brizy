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
      standart: ["cssStyleSizeWidthPercent"]
    },
    ".brz &&:hover .counter-figures": {
      standart: ["cssStyleColor"]
    },
    ".brz &&:hover .counter-chart-radial > svg > .pie-chart": {
      standart: ["cssStyleElementCounterChartWidth"]
    },
    ".brz &&:hover .counter-chart-empty > svg > .pie-chart": {
      standart: ["cssStyleElementCounterChartWidth"]
    },
    ".brz &&:hover .pie-chart": {
      standart: ["cssStyleElementCounterStrokeColor"]
    },
    ".brz &&:hover .radial-chart": {
      standart: ["cssStyleElementCounterFillColor"]
    },
    ".brz &&:hover .counter-chart-pie": {
      standart: ["cssStyleElementCounterFillColor"]
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
