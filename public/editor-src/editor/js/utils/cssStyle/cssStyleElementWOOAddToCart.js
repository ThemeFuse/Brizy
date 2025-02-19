import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleSizeHeight,
  cssStyleSizeWidth,
  cssStyleTextTransforms,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { styleSizeHeight, styleSizeWidth } from "visual/utils/style2";

export function cssStyleElementWOOAddToCartSize({ v, device }) {
  const width = styleSizeWidth({ v, device });
  const height = styleSizeHeight({ v, device });

  return width === undefined || height === undefined
    ? ""
    : `padding:${height}px ${width}px!important;`;
}

export function cssStyleElementWOOAddToCartInputRadius({ v, device, store }) {
  return cssStyleBorderRadius({ v, device, store, prefix: "input" });
}

export function cssStyleElementWOOAddToCartSpacing({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const position = dvv("inputPosition");
  const spacing = dvv("spacing");

  const marginType = {
    left: `margin: 0 ${spacing}px 0 0;`,
    right: `margin: 0 0 0 ${spacing}px;`,
    top: `margin: 0 0 ${spacing}px 0;`,
    bottom: `margin: ${spacing}px 0 0 0;`
  };

  return spacing === undefined || position === undefined
    ? ""
    : marginType[position];
}

export function cssStyleElementWOOAddToCartInputWidth({
  v,
  device,
  state,
  store
}) {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputHeight({
  v,
  device,
  state,
  store
}) {
  return cssStyleSizeHeight({ v, device, state, store, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputPosition({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const positionValue = dvv("inputPosition");
  const position = {
    left: "row",
    right: "row-reverse",
    top: "column",
    bottom: "column-reverse"
  };

  return `flex-direction: ${position[positionValue]};`;
}

export function cssStyleElementWOOAddToCartInputAlign({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const position = dvv("inputPosition");
  const vertical = dvv("inputVerticalAlign");
  const horisontal = dvv("inputHorizontalAlign");

  const flexDirection = {
    top: "flex-start",
    right: "flex-end",
    center: "center",
    bottom: "flex-end",
    left: "flex-start"
  };

  const positionValue =
    position === "left" || position === "right" ? vertical : horisontal;

  return `align-items: ${flexDirection[positionValue]};`;
}

export function cssStyleElementWOOAddToCartInputFontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "input",
    renderContext
  });
}

export function cssStyleElementWOOAddToCartInputFontSize({ v, device, store }) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputLineHeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputFontWeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputLetterSpacing({
  v,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "input"
  });
}

export function cssStyleElementWOOAddToCartInputFontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "input"
  });
}

export function cssStyleElementWOOAddToCartInputTextTransform({
  v,
  device,
  state,
  store
}) {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({ v, device, state, prefix: "inputColor", store });
}

export function cssStyleElementWOOAddToCartButtonColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({ v, device, state, prefix: "buttonColor", store });
}

export function cssStyleElementWOOAddToCartLabelFontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "label",
    renderContext
  });
}

export function cssStyleElementWOOAddToCartLabelFontSize({ v, device, store }) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "label" });
}

export function cssStyleElementWOOAddToCartLabelLineHeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "label" });
}

export function cssStyleElementWOOAddToCartLabelFontWeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "label" });
}

export function cssStyleElementWOOAddToCartLabelLetterSpacing({
  v,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "label"
  });
}

export function cssStyleElementWOOAddToCartLabelFontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "label"
  });
}

export function cssStyleElementWOOAddToCartLabelTextTransform({
  v,
  state,
  device,
  store
}) {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "label" });
}

export function cssStyleElementWOOAddToCartValueFontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "value",
    renderContext
  });
}

export function cssStyleElementWOOAddToCartValueFontSize({ v, device, store }) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "value" });
}

export function cssStyleElementWOOAddToCartValueLineHeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "value" });
}

export function cssStyleElementWOOAddToCartValueFontWeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "value" });
}

export function cssStyleElementWOOAddToCartValueLetterSpacing({
  v,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "value"
  });
}

export function cssStyleElementWOOAddToCartValueFontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "value"
  });
}

export function cssStyleElementWOOAddToCartValueTextTransform({
  v,
  state,
  device,
  store
}) {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "value" });
}

export function cssStyleElementWOOAddToCartLabelColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({ v, device, state, prefix: "labelColor", store });
}

export function cssStyleElementWOOAddToCartValueColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({ v, device, state, prefix: "valueColor", store });
}

export function cssStyleElementWOOAddToCartClearFontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "clear",
    renderContext
  });
}

export function cssStyleElementWOOAddToCartClearFontSize({ v, device, store }) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "clear" });
}

export function cssStyleElementWOOAddToCartClearLineHeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "clear" });
}

export function cssStyleElementWOOAddToCartClearFontWeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "clear" });
}

export function cssStyleElementWOOAddToCartClearLetterSpacing({
  v,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "clear"
  });
}

export function cssStyleElementWOOAddToCartClearFontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "clear"
  });
}

export function cssStyleElementWOOAddToCartClearTextTransform({
  v,
  state,
  device,
  store
}) {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "clear" });
}

export function cssStyleElementWOOAddToCartClearColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({ v, device, state, prefix: "clearColor", store });
}

export function cssStyleElementWOOAddToCartTableMargin({ v }) {
  return `margin-bottom: ${v.tableSpacing}px;`;
}

export function cssStyleElementWOOAddToCartTableBorder({
  v,
  device,
  state,
  store
}) {
  return cssStyleBorder({ v, device, state, prefix: "table", store });
}

export function cssStyleElementWOOAddToCartInputBg({
  v,
  device,
  state,
  store
}) {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    prefix: "inputBg"
  });
}

export function cssStyleElementWOOAddToCartTableBg({
  v,
  device,
  state,
  store
}) {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    prefix: "tableBg"
  });
}

export function cssStyleElementWOOAddToCartLabelBg({
  v,
  device,
  state,
  store
}) {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    prefix: "labelBg"
  });
}

export function cssStyleElementWOOAddToCartInputBorder({
  v,
  device,
  state,
  store
}) {
  return cssStyleBorder({ v, device, prefix: "input", state, store });
}

export function cssStyleElementWOOAddToCartInputBoxShadow({
  v,
  device,
  state,
  store
}) {
  return cssStyleBoxShadow({ v, device, prefix: "input", state, store });
}

export function cssStyleElementWOOAddToCartTableBoxShadow({
  v,
  device,
  state,
  store
}) {
  return cssStyleBoxShadow({ v, device, prefix: "table", state, store });
}

export function cssStyleElementWOOAddToCartBorder({ v, device, store }) {
  return cssStyleBorder({ v, device, store, prefix: "button" });
}

export function cssStyleElementWOOAddToCartBorderRadius({ v, device, store }) {
  return cssStyleBorderRadius({ v, device, prefix: "button", store });
}
