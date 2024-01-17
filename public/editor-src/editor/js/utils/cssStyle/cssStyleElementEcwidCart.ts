import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleFlexHorizontalAlign,
  cssStyleSizeHeight,
  cssStyleSizePadding,
  cssStyleSizeWidth,
  cssStyleSizeWidthHeight,
  cssStyleSpacing,
  cssStyleSpacingWithPadding,
  cssStyleTextAlign,
  getAllCssStyleTypography
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";
import { styleColor } from "../style2/styleColor";

export function cssStyleElementEcwidCartParentBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "parentBg" });
}

export function cssStyleElementEcwidCartParentBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "parent" });
}

// Style Title
export function cssStyleElementEcwidCartTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "titleColor" });
}

export function cssStyleElementEcwidCartTitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "titleTypography"
  });
}

export function cssStyleElementEcwidCartTitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "title" });
}

export function cssStyleElementEcwidCartTitleSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "title",
    direction: "bottom"
  });
}

// Style Title2
export function cssStyleElementEcwidCartTitle2Color({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "title2Color" });
}

export function cssStyleElementEcwidCartTitle2Typography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "title2Typography"
  });
}

export function cssStyleElementEcwidCartTitle2Align({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "title2" });
}

// Style Subtitle
export function cssStyleElementEcwidCartSubtitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "subtitleColor" });
}

export function cssStyleElementEcwidCartSubtitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "subtitleTypography"
  });
}

export function cssStyleElementEcwidCartSubtitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "subtitle" });
}

export function cssStyleElementEcwidCartSubtitleSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    direction: "bottom",
    prefix: "subtitle"
  });
}

// Style Button
export function cssStyleElementEcwidCartButtonTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "buttonTypography"
  });
}

export function cssStyleElementEcwidCartButtonSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "buttonColor" });
}

export function cssStyleElementEcwidCartButtonBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "buttonBg" });
}

export function cssStyleElementEcwidCartButtonBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "button",
    direction: "bottom"
  });
}

// Style Email
export function cssStyleElementEcwidCartEmailColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "emailColor" });
}

export function cssStyleElementEcwidCartEmailTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "emailTypography"
  });
}

export function cssStyleElementEcwidCartEmailAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "email" });
}

export function cssStyleElementEcwidCartEmailSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "email",
    direction: "bottom"
  });
}

// Style Checkbox
export function cssStyleElementEcwidCartCheckboxColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "checkboxColor" });
}

export function cssStyleElementEcwidCartCheckboxTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "checkboxTypography"
  });
}

export function cssStyleElementEcwidCartCheckboxSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "checkbox",
    direction: "bottom"
  });
}

// Style Next
export function cssStyleElementEcwidCartNextColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "nextColor" });
}

export function cssStyleElementEcwidCartNextTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "nextTypography"
  });
}

export function cssStyleElementEcwidCartNextAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "next" });
}

// Style Payment
export function cssStyleElementEcwidCartPaymentColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "paymentColor" });
}

export function cssStyleElementEcwidCartPaymentTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "paymentTypography"
  });
}

export function cssStyleElementEcwidCartPaymentAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "payment" });
}

// Style Input
export function cssStyleElementEcwidCartInputColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "inputColor" });
}

export function cssStyleElementEcwidCartInputColorAutofill({
  v,
  device,
  state
}: CSSValue): string {
  const color = styleColor({ v, device, state, prefix: "inputColor" });

  return `-webkit-text-fill-color:${color}!important`;
}

export function cssStyleElementEcwidCartInputTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "inputTypography"
  });
}

export function cssStyleElementEcwidCartInputBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "inputBg" });
}

export function cssStyleElementEcwidCartInputBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputBorderColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "input",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidCartInputAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "input" });
}

// Style Product Name
export function cssStyleElementEcwidCartProductNameColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "productNameColor"
  });
}

export function cssStyleElementEcwidCartProductNameTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "productNameTypography"
  });
}

export function cssStyleElementEcwidCartProductNameAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "productName"
  });
}

// Style Product Size
export function cssStyleElementEcwidCartProductSizeColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "productSizeColor"
  });
}

export function cssStyleElementEcwidCartProductSizeTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "productSizeTypography"
  });
}

export function cssStyleElementEcwidCartProductSizeAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "productSize"
  });
}

// Style Empty Cart
export function cssStyleElementEcwidCartEmptyColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "emptyColor"
  });
}

export function cssStyleElementEcwidCartEmptyTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "emptyTypography"
  });
}

export function cssStyleElementEcwidCartEmptyAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "empty"
  });
}

export function cssStyleElementEcwidCartEmptySpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "empty",
    direction: "bottom"
  });
}

// Style Footer
export function cssStyleElementEcwidCartFooterIconSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({ v, device, state, prefix: "footerIcon" });
}

export function cssStyleElementEcwidCartFooterIconSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "footer",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidCartFooterIconColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "footerIconColor"
  });
}

export function cssStyleElementEcwidCartFooterColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "footerColor" });
}

export function cssStyleElementEcwidCartFooterTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "footerTypography"
  });
}

export function cssStyleElementEcwidCartWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "cart" });
}

export function cssStyleElementEcwidCartImageWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "image" });
}

export function cssStyleElementEcwidCartImageBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "image" });
}

export function cssStyleElementEcwidCartImageBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "image" });
}

export function cssStyleElementEcwidCartImageBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "image" });
}

export function cssStyleElementEcwidCartImageSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "image",
    direction: "right"
  });
}

export function cssStyleElementEcwidCartSummaryTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "summaryTitleColor" });
}

export function cssStyleElementEcwidCartSummaryTitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "summaryTitleTypography"
  });
}

export function cssStyleElementEcwidCartSummaryPriceColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "summaryPriceColor" });
}

export function cssStyleElementEcwidCartSummaryPriceTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "summaryPriceTypography"
  });
}

export function cssStyleElementEcwidCartQtyTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "qtyTypography"
  });
}

export function cssStylePropertyHoverTransitionElementEcwid(): string {
  return "transition-property: color, filter, box-shadow, background, border-radius, border-color;";
}

export function cssStyleElementEcwidCartCloseIconColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "closeColor" });
}

export function cssStyleElementEcwidCartCloseBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "closeBg" });
}

export function cssStyleElementEcwidCartCloseBorderColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "close" });
}

export function cssStyleElementEcwidCartCloseBorderRadiusColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "close" });
}

export function cssStyleElementEcwidCartCloseBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "close" });
}

export function cssStyleElementEcwidCartClosePadding({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const padding = dvv("closePadding");
  const suffix = dvv("closePaddingSuffix");

  return `padding:${padding}${suffix};`;
}

export function cssStyleElementEcwidCartCloseSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({ v, device, state, prefix: "close" });
}

export function cssStyleElementEcwidCartCloseSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "close",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidCartCollapsedImageWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "collapsedImage" });
}

export function cssStyleElementEcwidCartCollapsedImageBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "collapsedImage" });
}

export function cssStyleElementEcwidCartCollapsedImageBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "collapsedImage" });
}

export function cssStyleElementEcwidCartCollapsedImageBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "collapsedImage" });
}

export function cssStyleElementEcwidCartCollapsedImageSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacingWithPadding({
    v,
    device,
    state,
    prefix: "collapsedImage",
    direction: "right"
  });
}

export function cssStyleElementEcwidCartTotalProductsCountColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "cartTotalProductsCountColor"
  });
}

export function cssStyleElementEcwidCartTotalProductsCountTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "cartTotalProductsCountTypography"
  });
}

export function cssStyleElementEcwidCartSubtotalTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "subtotalTitleColor" });
}

export function cssStyleElementEcwidCartSubtotalTitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "subtotalTitleTypography"
  });
}

export function cssStyleElementEcwidCartSubtotalPriceColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "subtotalPriceColor" });
}

export function cssStyleElementEcwidCartSubtotalPriceTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "subtotalPriceTypography"
  });
}

export function cssStyleElementEcwidCartTaxesTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "taxesTitleColor" });
}

export function cssStyleElementEcwidCartTaxesTitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "taxesTitleTypography"
  });
}

export function cssStyleElementEcwidCartTaxesPriceColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "taxesPriceColor" });
}

export function cssStyleElementEcwidCartTaxesPriceTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "taxesPriceTypography"
  });
}

export function cssStyleElementEcwidCartSummaryNoteColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "summaryNoteColor" });
}

export function cssStyleElementEcwidCartSummaryNoteTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "summaryNoteTypography"
  });
}
