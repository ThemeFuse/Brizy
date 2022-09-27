import {
  cssStyleSizeMinHeightPx,
  cssStyleSizeMinWidth
} from "visual/utils/cssStyle";
import {
  styleColor,
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
  return cssStyleSizeMinWidth({ v, device, state, prefix: "openButton" });
}

export function cssStyleElementSearchMinHeight({ v, device, state }) {
  return cssStyleSizeMinHeightPx({ v, device, state, prefix: "openButton" });
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
