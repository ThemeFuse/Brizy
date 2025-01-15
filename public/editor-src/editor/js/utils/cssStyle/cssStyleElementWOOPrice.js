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

export function cssStyleElementWOOPriceColorSale({ v, device, store, state }) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "saleColor"
  });
}

export function cssStyleElementWOOPriceSaleFontFamily({
  v,
  device,
  store,
  prefix = "sale",
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({ v, device, store, prefix, renderContext })};`
    : "";
}

export function cssStyleElementWOOPriceSaleFontSize({
  v,
  device,
  store,
  prefix = "sale"
}) {
  return `font-size:${styleTypography2FontSize({ v, device, store, prefix })}px;`;
}

export function cssStyleElementWOOPriceSaleLineHeight({
  v,
  device,
  store,
  prefix = "sale"
}) {
  return `line-height:${styleTypography2LineHeight({ v, device, store, prefix })};`;
}

export function cssStyleElementWOOPriceSaleFontWeight({
  v,
  device,
  store,
  prefix = "sale"
}) {
  return `font-weight:${styleTypography2FontWeight({ v, device, store, prefix })};`;
}

export function cssStyleElementWOOPriceSaleLetterSpacing({
  v,
  device,
  store,
  prefix = "sale"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix
  })}px;`;
}

export function cssStyleElementWOOPriceSaleFontVariation({ v, store, device }) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "sale"
  });
}

export function cssStyleElementWOOPriceSaleTextTransform({
  v,
  state,
  store,
  device
}) {
  return cssStyleTextTransforms({
    v,
    state,
    device,
    store,
    prefix: "sale"
  });
}

export function cssStyleElementWOOPriceColumn({ v, device, state }) {
  const column =
    styleElementWOOPriceColumn({ v, device, state }) === "on"
      ? "column"
      : "row";

  return column === undefined ? "" : `flex-direction: ${column};`;
}

export function cssStyleElementWOOPriceSpacingFirst({ v, device, state }) {
  const column = styleElementWOOPriceColumn({ v, device, state });
  const spacing = styleElementWOOPriceSpacing({ v, device, state }) / 2;

  return spacing === undefined
    ? ""
    : column === "on"
      ? `margin: 0 0 ${spacing}px 0;`
      : `margin: 0 ${spacing}px 0 0;`;
}

export function cssStyleElementWOOPriceSpacingLast({ v, device, state }) {
  const column = styleElementWOOPriceColumn({ v, device, state });
  const spacing = styleElementWOOPriceSpacing({ v, device, state }) / 2;

  return spacing === undefined
    ? ""
    : column === "on"
      ? `margin: ${spacing}px 0 0 0;`
      : `margin: 0 0 0 ${spacing}px;`;
}
