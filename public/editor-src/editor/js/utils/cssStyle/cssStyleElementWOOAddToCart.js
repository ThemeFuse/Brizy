import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleSizeHeight,
  cssStyleSizeWidth,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
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

export function cssStyleElementWOOAddToCartInputRadius({ v, device }) {
  return cssStyleBorderRadius({ v, device, prefix: "input" });
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

export function cssStyleElementWOOAddToCartInputWidth({ v, device, state }) {
  return cssStyleSizeWidth({ v, device, state, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputHeight({ v, device, state }) {
  return cssStyleSizeHeight({ v, device, state, prefix: "input" });
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

export function cssStyleElementWOOAddToCartInputFontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputFontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputLineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputFontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputLetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "input" });
}

export function cssStyleElementWOOAddToCartInputColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "inputColor" });
}

export function cssStyleElementWOOAddToCartButtonColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "buttonColor" });
}

export function cssStyleElementWOOAddToCartLabelFontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "label" });
}

export function cssStyleElementWOOAddToCartLabelFontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "label" });
}

export function cssStyleElementWOOAddToCartLabelLineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "label" });
}

export function cssStyleElementWOOAddToCartLabelFontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "label" });
}

export function cssStyleElementWOOAddToCartLabelLetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "label" });
}

export function cssStyleElementWOOAddToCartValueFontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "value" });
}

export function cssStyleElementWOOAddToCartValueFontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "value" });
}

export function cssStyleElementWOOAddToCartValueLineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "value" });
}

export function cssStyleElementWOOAddToCartValueFontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "value" });
}

export function cssStyleElementWOOAddToCartValueLetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "value" });
}

export function cssStyleElementWOOAddToCartLabelColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "labelColor" });
}

export function cssStyleElementWOOAddToCartValueColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "valueColor" });
}

export function cssStyleElementWOOAddToCartClearFontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "clear" });
}

export function cssStyleElementWOOAddToCartClearFontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "clear" });
}

export function cssStyleElementWOOAddToCartClearLineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "clear" });
}

export function cssStyleElementWOOAddToCartClearFontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "clear" });
}

export function cssStyleElementWOOAddToCartClearLetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "clear" });
}

export function cssStyleElementWOOAddToCartClearColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "clearColor" });
}

export function cssStyleElementWOOAddToCartTableMargin({ v }) {
  return `margin-bottom: ${v.tableSpacing}px;`;
}

export function cssStyleElementWOOAddToCartTableBorder({ v, device, state }) {
  return cssStyleBorder({ v, device, state, prefix: "table" });
}

export function cssStyleElementWOOAddToCartInputBg({ v, device, state }) {
  return cssStyleBgColor({
    v,
    device,
    state,
    prefix: "inputBg"
  });
}

export function cssStyleElementWOOAddToCartTableBg({ v, device, state }) {
  return cssStyleBgColor({
    v,
    device,
    state,
    prefix: "tableBg"
  });
}

export function cssStyleElementWOOAddToCartLabelBg({ v, device, state }) {
  return cssStyleBgColor({
    v,
    device,
    state,
    prefix: "labelBg"
  });
}

export function cssStyleElementWOOAddToCartInputBorder({ v, device, state }) {
  return cssStyleBorder({ v, device, prefix: "input", state });
}

export function cssStyleElementWOOAddToCartInputBoxShadow({
  v,
  device,
  state
}) {
  return cssStyleBoxShadow({ v, device, prefix: "input", state });
}

export function cssStyleElementWOOAddToCartTableBoxShadow({
  v,
  device,
  state
}) {
  return cssStyleBoxShadow({ v, device, prefix: "table", state });
}

export function cssStyleElementWOOAddToCartBorder({ v, device }) {
  return cssStyleBorder({ v, device, prefix: "button" });
}

export function cssStyleElementWOOAddToCartBorderRadius({ v, device }) {
  return cssStyleBorderRadius({ v, device, prefix: "button" });
}

export function cssStyleElementWOOAddToCartPropertyHoverTransition() {
  return "transition-property: color, box-shadow, background, border-color;";
}
