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

export function cssStyleElementWOOPriceColorSale({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "saleColor"
  });
}

export function cssStyleElementWOOPriceSaleFontFamily({
  v,
  device,
  prefix = "sale"
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({ v, device, prefix })};`
    : "";
}

export function cssStyleElementWOOPriceSaleFontSize({
  v,
  device,
  prefix = "sale"
}) {
  return `font-size:${styleTypography2FontSize({ v, device, prefix })}px;`;
}

export function cssStyleElementWOOPriceSaleLineHeight({
  v,
  device,
  prefix = "sale"
}) {
  return `line-height:${styleTypography2LineHeight({ v, device, prefix })};`;
}

export function cssStyleElementWOOPriceSaleFontWeight({
  v,
  device,
  prefix = "sale"
}) {
  return `font-weight:${styleTypography2FontWeight({ v, device, prefix })};`;
}

export function cssStyleElementWOOPriceSaleLetterSpacing({
  v,
  device,
  prefix = "sale"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementWOOPriceSaleFontVariation({ v, device }) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    prefix: "sale"
  });
}

export function cssStyleElementWOOPriceSaleTextTransform({ v, state, device }) {
  return cssStyleTextTransforms({
    v,
    state,
    device,
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
