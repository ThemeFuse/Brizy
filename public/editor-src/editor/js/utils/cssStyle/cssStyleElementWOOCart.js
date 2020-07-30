import {
  styleElementWOOCartSubtotalDisabled,
  styleElementWOOCartPurchasesDisabled,
  styleElementWOOCartButtonDirection,
  styleElementWOOCartButtonSpacing
} from "visual/utils/style2";

import {
  cssStyleColor,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight,
  cssStyleBgColor
} from "visual/utils/cssStyle";

import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";

export function cssStyleElementWOOCartIconColor({
  v,
  device,
  state,
  prefix = "iconColor"
}) {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementWOOCartSubtotalDisabled({ v, device, state }) {
  const disabled = styleElementWOOCartSubtotalDisabled({ v, device, state });

  return disabled === undefined || disabled === "on" ? "" : "display: none;";
}

export function cssStyleElementWOOCartPurchasesDisabled({ v, device, state }) {
  const disabled = styleElementWOOCartPurchasesDisabled({ v, device, state });

  return disabled === undefined || disabled === "off"
    ? ""
    : "content: attr(data-counter);";
}

export function cssStyleElementWOOCartTransitionProperty() {
  return "transition-property: background-color,color,border;";
}

export function cssStyleElementWOOCartPurchasesColor({
  v,
  device,
  state,
  prefix = "purchasesColor"
}) {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementWOOCartPurchasesFontFamily({
  v,
  device,
  prefix = "purchases"
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix });
}

export function cssStyleElementWOOCartPurchasesFontSize({
  v,
  device,
  prefix = "purchases"
}) {
  return cssStyleTypography2FontSize({ v, device, prefix });
}

export function cssStyleElementWOOCartPurchasesLineHeight({
  v,
  device,
  prefix = "purchases"
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix });
}

export function cssStyleElementWOOCartPurchasesFontWeight({
  v,
  device,
  prefix = "purchases"
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix });
}

export function cssStyleElementWOOCartPurchasesLetterSpacing({
  v,
  device,
  prefix = "purchases"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix });
}

export function cssStyleElementWOOCartTitleFontFamily({
  v,
  device,
  prefix = "title"
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix });
}

export function cssStyleElementWOOCartTitleFontSize({
  v,
  device,
  prefix = "title"
}) {
  return cssStyleTypography2FontSize({ v, device, prefix });
}

export function cssStyleElementWOOCartTitleLineHeight({
  v,
  device,
  prefix = "title"
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix });
}

export function cssStyleElementWOOCartTitleFontWeight({
  v,
  device,
  prefix = "title"
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix });
}

export function cssStyleElementWOOCartTitleLetterSpacing({
  v,
  device,
  prefix = "title"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix });
}

export function cssStyleElementWOOCartCostFontFamily({
  v,
  device,
  prefix = "cost"
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix });
}

export function cssStyleElementWOOCartCostFontSize({
  v,
  device,
  prefix = "cost"
}) {
  return cssStyleTypography2FontSize({ v, device, prefix });
}

export function cssStyleElementWOOCartCostLineHeight({
  v,
  device,
  prefix = "cost"
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix });
}

export function cssStyleElementWOOCartCostFontWeight({
  v,
  device,
  prefix = "cost"
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix });
}

export function cssStyleElementWOOCartCostLetterSpacing({
  v,
  device,
  prefix = "cost"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix });
}

export function cssStyleElementWOOCartSubtotalFontFamily({
  v,
  device,
  prefix = "subtotal"
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix });
}

export function cssStyleElementWOOCartSubtotalFontSize({
  v,
  device,
  prefix = "subtotal"
}) {
  return cssStyleTypography2FontSize({ v, device, prefix });
}

export function cssStyleElementWOOCartSubtotalLineHeight({
  v,
  device,
  prefix = "subtotal"
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix });
}

export function cssStyleElementWOOCartSubtotalFontWeight({
  v,
  device,
  prefix = "subtotal"
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix });
}

export function cssStyleElementWOOCartSubtotalLetterSpacing({
  v,
  device,
  prefix = "subtotal"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix });
}

export function cssStyleElementWOOCartButtonFontFamily({
  v,
  device,
  prefix = "button"
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix });
}

export function cssStyleElementWOOCartButtonFontSize({
  v,
  device,
  prefix = "button"
}) {
  return cssStyleTypography2FontSize({ v, device, prefix });
}

export function cssStyleElementWOOCartButtonLineHeight({
  v,
  device,
  prefix = "button"
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix });
}

export function cssStyleElementWOOCartButtonFontWeight({
  v,
  device,
  prefix = "button"
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix });
}

export function cssStyleElementWOOCartButtonLetterSpacing({
  v,
  device,
  prefix = "button"
}) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix });
}

export function cssStyleElementWOOCartTitleColor({
  v,
  device,
  state,
  prefix = "titleColor"
}) {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementWOOCartCostColor({
  v,
  device,
  state,
  prefix = "costColor"
}) {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementWOOCartSubtotalColor({
  v,
  device,
  state,
  prefix = "subtotalColor"
}) {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementWOOCartButtonColor({
  v,
  device,
  state,
  prefix = "buttonColor"
}) {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementWOOCartButtonBgColor({
  v,
  device,
  state,
  prefix = "buttonBg"
}) {
  return cssStyleBgColor({ v, device, state, prefix });
}

export function cssStyleElementWOOCartButtonDirection({ v, device, state }) {
  const direction =
    styleElementWOOCartButtonDirection({ v, device, state }) === "inline"
      ? "row"
      : "column";

  return direction === undefined ? "" : `flex-direction: ${direction};`;
}

export function cssStyleElementWOOCartButtonSpacing({ v, device, state }) {
  const direction = styleElementWOOCartButtonDirection({ v, device, state });
  const spacing = styleElementWOOCartButtonSpacing({ v, device, state });

  return spacing === undefined
    ? ""
    : direction === "inline"
    ? `width: calc(50% - ${spacing / 2}px);`
    : `width: 100%; margin-bottom: ${spacing}px;`;
}

export function cssStyleElementWOOCartButtonBorderRadius({ v, device, state }) {
  return cssStyleBorderRadius({ v, device, state, prefix: "button" });
}
