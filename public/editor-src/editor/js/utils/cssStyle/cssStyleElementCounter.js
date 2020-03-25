import {
  styleElementCounterStrokeColor,
  styleElementCounterFillColor
} from "visual/utils/style2";

export function cssStyleElementCounterChartEnd({ v }) {
  return `stroke-dasharray: calc(${v.end} + 0.5) 100;`;
}

export function cssStyleElementCounterChartWidth({ v }) {
  return `stroke-width: ${v.strokeWidth} !important;`;
}

export function cssStyleElementCounterFillColor({
  v,
  device,
  state,
  prefix = "fillColor"
}) {
  const fillColor = styleElementCounterFillColor({ v, device, state, prefix });

  return fillColor === undefined ? "" : `fill:${fillColor};`;
}

export function cssStyleElementCounterStrokeColor({
  v,
  device,
  state,
  prefix = "strokeColor"
}) {
  const strokeColor = styleElementCounterStrokeColor({
    v,
    device,
    state,
    prefix
  });

  return strokeColor === undefined ? "" : `stroke:${strokeColor};`;
}

export function cssStyleElementCounterTransitionHoverProperty() {
  return "transition-property: color, fill, stroke";
}
