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

export function cssStyleElementWOOAddToCartSize({ v, device, getConfig }) {
  const width = styleSizeWidth({ v, getConfig, device });
  const height = styleSizeHeight({ v, getConfig, device });

  return width === undefined || height === undefined
    ? ""
    : `padding:${height}px ${width}px!important;`;
}

export function cssStyleElementWOOAddToCartInputRadius({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleBorderRadius({ v, device, store, getConfig, prefix: "input" });
}

export function cssStyleElementWOOAddToCartSpacing({ v, getConfig, device }) {
  const dvv = (key) => defaultValueValue({ v, key, getConfig, device });

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
  getConfig,
  store
}) {
  return cssStyleSizeWidth({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementWOOAddToCartInputHeight({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleSizeHeight({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementWOOAddToCartInputPosition({
  v,
  getConfig,
  device
}) {
  const dvv = (key) => defaultValueValue({ v, key, getConfig, device });

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
  getConfig,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "input",
    renderContext
  });
}

export function cssStyleElementWOOAddToCartInputFontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementWOOAddToCartInputLineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementWOOAddToCartInputFontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementWOOAddToCartInputLetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementWOOAddToCartInputFontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementWOOAddToCartInputTextTransform({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementWOOAddToCartInputColor({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    prefix: "inputColor",
    store
  });
}

export function cssStyleElementWOOAddToCartButtonColor({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    prefix: "buttonColor",
    store
  });
}

export function cssStyleElementWOOAddToCartLabelFontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "label",
    renderContext
  });
}

export function cssStyleElementWOOAddToCartLabelFontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    getConfig,
    store,
    prefix: "label"
  });
}

export function cssStyleElementWOOAddToCartLabelLineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    getConfig,
    store,
    prefix: "label"
  });
}

export function cssStyleElementWOOAddToCartLabelFontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "label"
  });
}

export function cssStyleElementWOOAddToCartLabelLetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix: "label"
  });
}

export function cssStyleElementWOOAddToCartLabelFontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "label"
  });
}

export function cssStyleElementWOOAddToCartLabelTextTransform({
  v,
  state,
  device,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "label"
  });
}

export function cssStyleElementWOOAddToCartValueFontFamily({
  v,
  device,
  getConfig,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "value",
    renderContext
  });
}

export function cssStyleElementWOOAddToCartValueFontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "value"
  });
}

export function cssStyleElementWOOAddToCartValueLineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "value"
  });
}

export function cssStyleElementWOOAddToCartValueFontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "value"
  });
}

export function cssStyleElementWOOAddToCartValueLetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "value"
  });
}

export function cssStyleElementWOOAddToCartValueFontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "value"
  });
}

export function cssStyleElementWOOAddToCartValueTextTransform({
  v,
  state,
  device,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "value"
  });
}

export function cssStyleElementWOOAddToCartLabelColor({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    prefix: "labelColor",
    store
  });
}

export function cssStyleElementWOOAddToCartValueColor({
  v,
  device,
  state,
  store,
  getConfig
}) {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "valueColor",
    store,
    getConfig
  });
}

export function cssStyleElementWOOAddToCartClearFontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "clear",
    renderContext
  });
}

export function cssStyleElementWOOAddToCartClearFontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "clear"
  });
}

export function cssStyleElementWOOAddToCartClearLineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "clear"
  });
}

export function cssStyleElementWOOAddToCartClearFontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "clear"
  });
}

export function cssStyleElementWOOAddToCartClearLetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "clear"
  });
}

export function cssStyleElementWOOAddToCartClearFontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "clear"
  });
}

export function cssStyleElementWOOAddToCartClearTextTransform({
  v,
  state,
  device,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "clear"
  });
}

export function cssStyleElementWOOAddToCartClearColor({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    prefix: "clearColor",
    store
  });
}

export function cssStyleElementWOOAddToCartTableMargin({ v }) {
  return `margin-bottom: ${v.tableSpacing}px;`;
}

export function cssStyleElementWOOAddToCartTableBorder({
  v,
  device,
  getConfig,
  state,
  store
}) {
  return cssStyleBorder({
    v,
    device,
    state,
    getConfig,
    prefix: "table",
    store
  });
}

export function cssStyleElementWOOAddToCartInputBg({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleBgColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "inputBg"
  });
}

export function cssStyleElementWOOAddToCartTableBg({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleBgColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "tableBg"
  });
}

export function cssStyleElementWOOAddToCartLabelBg({
  v,
  device,
  getConfig,
  state,
  store
}) {
  return cssStyleBgColor({
    v,
    device,
    getConfig,
    state,
    store,
    prefix: "labelBg"
  });
}

export function cssStyleElementWOOAddToCartInputBorder({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleBorder({
    v,
    device,
    prefix: "input",
    state,
    getConfig,
    store
  });
}

export function cssStyleElementWOOAddToCartInputBoxShadow({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleBoxShadow({
    v,
    device,
    prefix: "input",
    state,
    getConfig,
    store
  });
}

export function cssStyleElementWOOAddToCartTableBoxShadow({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleBoxShadow({
    v,
    device,
    prefix: "table",
    state,
    getConfig,
    store
  });
}

export function cssStyleElementWOOAddToCartBorder({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleBorder({ v, device, store, getConfig, prefix: "button" });
}

export function cssStyleElementWOOAddToCartBorderRadius({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleBorderRadius({
    v,
    device,
    prefix: "button",
    getConfig,
    store
  });
}
