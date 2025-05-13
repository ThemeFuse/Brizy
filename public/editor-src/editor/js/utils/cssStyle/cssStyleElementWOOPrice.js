import {
  cssStyleColor,
  cssStyleTextTransforms,
  cssStyleTypography2FontVariation
} from "visual/utils/cssStyle";
import {
  styleElementWOOPriceColumn,
  styleElementWOOPriceSpacing,
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleTypography2LineHeight
} from "visual/utils/style2";

export function cssStyleElementWOOPriceColorSale({
  v,
  device,
  store,
  state,
  getConfig
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "saleColor"
  });
}

export function cssStyleElementWOOPriceSaleFontFamily({
  v,
  device,
  store,
  getConfig,
  prefix = "sale",
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({ v, device, store, prefix, renderContext, getConfig })};`
    : "";
}

export function cssStyleElementWOOPriceSaleFontSize({
  v,
  device,
  store,
  getConfig,
  prefix = "sale"
}) {
  return `font-size:${styleTypography2FontSize({ v, device, store, prefix, getConfig })}px;`;
}

export function cssStyleElementWOOPriceSaleLineHeight({
  v,
  device,
  store,
  getConfig,
  prefix = "sale"
}) {
  return `line-height:${styleTypography2LineHeight({ v, device, store, prefix, getConfig })};`;
}

export function cssStyleElementWOOPriceSaleFontWeight({
  v,
  device,
  store,
  getConfig,
  prefix = "sale"
}) {
  return `font-weight:${styleTypography2FontWeight({ v, device, store, getConfig, prefix })};`;
}

export function cssStyleElementWOOPriceSaleLetterSpacing({
  v,
  device,
  store,
  getConfig,
  prefix = "sale"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix
  })}px;`;
}

export function cssStyleElementWOOPriceSaleFontVariation({
  v,
  store,
  getConfig,
  device
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "sale"
  });
}

export function cssStyleElementWOOPriceSaleTextTransform({
  v,
  state,
  store,
  getConfig,
  device
}) {
  return cssStyleTextTransforms({
    v,
    state,
    device,
    store,
    getConfig,
    prefix: "sale"
  });
}

export function cssStyleElementWOOPriceColumn({ v, device, getConfig, state }) {
  const column =
    styleElementWOOPriceColumn({ v, device, getConfig, state }) === "on"
      ? "column"
      : "row";

  return column === undefined ? "" : `flex-direction: ${column};`;
}

export function cssStyleElementWOOPriceSpacingFirst({
  v,
  device,
  getConfig,
  state
}) {
  const column = styleElementWOOPriceColumn({ v, device, getConfig, state });
  const spacing =
    styleElementWOOPriceSpacing({ v, device, getConfig, state }) / 2;

  return spacing === undefined
    ? ""
    : column === "on"
      ? `margin: 0 0 ${spacing}px 0;`
      : `margin: 0 ${spacing}px 0 0;`;
}

export function cssStyleElementWOOPriceSpacingLast({
  v,
  device,
  getConfig,
  state
}) {
  const column = styleElementWOOPriceColumn({ v, device, getConfig, state });
  const spacing =
    styleElementWOOPriceSpacing({ v, device, getConfig, state }) / 2;

  return spacing === undefined
    ? ""
    : column === "on"
      ? `margin: ${spacing}px 0 0 0;`
      : `margin: 0 0 0 ${spacing}px;`;
}
