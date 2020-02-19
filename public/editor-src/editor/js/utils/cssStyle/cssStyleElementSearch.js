import {
  styleColor,
  styleElementSearchMinWidth,
  styleElementSearchMinHeight
} from "visual/utils/style2";

export function cssStyleElementSearchAutocompleteColor({
  v,
  device,
  state,
  prefix
}) {
  const color = styleColor({ v, device, state, prefix });

  return color === undefined ? "" : `-webkit-text-fill-color:${color};`;
}

export function cssStyleElementSearchMinWidth({ v, device, state }) {
  const width = styleElementSearchMinWidth({ v, device, state });

  return width === undefined ? "" : `min-width: ${width}px;`;
}

export function cssStyleElementSearchMinHeight({ v, device, state }) {
  const height = styleElementSearchMinHeight({ v, device, state });

  return height === undefined ? "" : `min-height: ${height}px;`;
}

export function cssStyleElementSearchPropertyHoverTransition() {
  return "transition-property:background-color,color,border,box-shadow;";
}
