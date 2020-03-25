import {
  styleColor,
  styleElementSearchMinWidth,
  styleElementSearchMinHeight,
  styleTypography2FontSize,
  styleTypography2LineHeight
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

export function cssStyleElementSearchLineHeight({ v, device }) {
  const fontSize = styleTypography2FontSize({
    v,
    device,
    prefix: "typography"
  });
  const lineHeight = styleTypography2LineHeight({
    v,
    device,
    prefix: "typography"
  });

  return fontSize === undefined || lineHeight === undefined
    ? ""
    : `height: ${fontSize * lineHeight}px;`;
}
