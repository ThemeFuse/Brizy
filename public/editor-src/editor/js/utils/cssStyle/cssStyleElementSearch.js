import {
  styleColor,
  styleTypography2FontSize,
  styleTypography2LineHeight
} from "visual/utils/style2";

export function cssStyleElementSearchAutocompleteColor({
  v,
  device,
  state,
  store,
  prefix
}) {
  const color = styleColor({ v, device, state, store, prefix });

  return color === undefined ? "" : `-webkit-text-fill-color:${color};`;
}

export function cssStyleElementSearchLineHeight({ v, device, store }) {
  const fontSize = styleTypography2FontSize({
    v,
    device,
    store,
    prefix: "typography"
  });
  const lineHeight = styleTypography2LineHeight({
    v,
    device,
    store,
    prefix: "typography"
  });

  return fontSize === undefined || lineHeight === undefined
    ? ""
    : `height: ${fontSize * lineHeight}px;`;
}
