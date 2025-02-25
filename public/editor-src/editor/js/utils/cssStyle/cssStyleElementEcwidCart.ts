import { WithRenderContext } from "visual/providers/RenderProvider";
import {
  FlexHorizontalAligns,
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
  getAllCssStyleTypography,
  readHorizontalAlign
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { styleAlignHorizontal } from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";
import { styleColor } from "../style2/styleColor";

export function cssStyleElementEcwidCartParentBgColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, store, state, prefix: "parentBg" });
}

export function cssStyleElementEcwidCartParentBgGradient({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, store, state, prefix: "parent" });
}

// Style Title
export function cssStyleElementEcwidCartTitleColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "titleColor" });
}

export function cssStyleElementEcwidCartTitleTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "titleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartTitleAlign({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, store, state, prefix: "title" });
}

export function cssStyleElementEcwidCartTitleSpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    prefix: "title",
    direction: "bottom"
  });
}

// Style Title2
export function cssStyleElementEcwidCartTitle2Color({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "title2Color" });
}

export function cssStyleElementEcwidCartTitle2Typography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "title2Typography",
    renderContext
  });
}

export function cssStyleElementEcwidCartTitle2Align({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, store, state, prefix: "title2" });
}

// Style Subtitle
export function cssStyleElementEcwidCartSubtitleColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "subtitleColor" });
}

export function cssStyleElementEcwidCartSubtitleTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "subtitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartSubtitleAlign({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, store, state, prefix: "subtitle" });
}

export function cssStyleElementEcwidCartSubtitleSpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    direction: "bottom",
    prefix: "subtitle"
  });
}

// Style Button
export function cssStyleElementEcwidCartButtonTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "buttonTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartButtonSize({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, store, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonWidth({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, store, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "buttonColor" });
}

export function cssStyleElementEcwidCartButtonBgColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, store, state, prefix: "buttonBg" });
}

export function cssStyleElementEcwidCartButtonBgGradient({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, store, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonBorderRadius({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, store, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonBoxShadow({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, store, state, prefix: "button" });
}

export function cssStyleElementEcwidCartButtonAlign({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    store,
    state,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonAlignVertically({
  v,
  device,
  store,
  state
}: CSSValue): string {
  const alignItems = readHorizontalAlign(
    styleAlignHorizontal({
      v,
      device,
      state,
      store,
      prefix: "button"
    })
  );

  return alignItems ? `align-items:${FlexHorizontalAligns[alignItems]};` : "";
}

export function cssStyleElementEcwidCartButtonSpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    prefix: "button",
    direction: "bottom"
  });
}

// Style Email
export function cssStyleElementEcwidCartEmailColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "emailColor" });
}

export function cssStyleElementEcwidCartEmailTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "emailTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartEmailAlign({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, store, state, prefix: "email" });
}

export function cssStyleElementEcwidCartEmailSpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    prefix: "email",
    direction: "bottom"
  });
}

// Style Checkbox
export function cssStyleElementEcwidCartCheckboxColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "checkboxColor" });
}

export function cssStyleElementEcwidCartCheckboxTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "checkboxTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartCheckboxSpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    prefix: "checkbox",
    direction: "bottom"
  });
}

// Style Next
export function cssStyleElementEcwidCartNextColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "nextColor" });
}

export function cssStyleElementEcwidCartNextTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "nextTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartNextAlign({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, store, state, prefix: "next" });
}

// Style Payment
export function cssStyleElementEcwidCartPaymentColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "paymentColor" });
}

export function cssStyleElementEcwidCartPaymentTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "paymentTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartPaymentAlign({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, store, state, prefix: "payment" });
}

// Style Input
export function cssStyleElementEcwidCartInputColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "inputColor" });
}

export function cssStyleElementEcwidCartInputColorAutofill({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const color = styleColor({ v, device, state, store, prefix: "inputColor" });

  return `-webkit-text-fill-color:${color}!important`;
}

export function cssStyleElementEcwidCartInputTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "inputTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartInputBorderRadius({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, store, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputHeight({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, store, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputWidth({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, store, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputBgColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, store, state, prefix: "inputBg" });
}

export function cssStyleElementEcwidCartInputBgGradient({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, store, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputBorderColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, prefix: "input" });
}

export function cssStyleElementEcwidCartInputBoxShadow({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, store, state, prefix: "input" });
}

export function cssStyleElementEcwidCartInputSpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    prefix: "input",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidCartInputAlign({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    store,
    state,
    prefix: "input"
  });
}

// Style Product Name
export function cssStyleElementEcwidCartProductNameColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "productNameColor"
  });
}

export function cssStyleElementEcwidCartProductNameTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "productNameTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartProductNameAlign({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    store,
    state,
    prefix: "productName"
  });
}

// Style Product Size
export function cssStyleElementEcwidCartProductSizeColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "productSizeColor"
  });
}

export function cssStyleElementEcwidCartProductSizeTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "productSizeTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartProductSizeAlign({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    store,
    state,
    prefix: "productSize"
  });
}

// Style Empty Cart
export function cssStyleElementEcwidCartEmptyColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "emptyColor"
  });
}

export function cssStyleElementEcwidCartEmptyTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "emptyTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartEmptyAlign({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    store,
    state,
    prefix: "empty"
  });
}

export function cssStyleElementEcwidCartEmptySpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    prefix: "empty",
    direction: "bottom"
  });
}

// Style Footer
export function cssStyleElementEcwidCartFooterIconSize({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({
    v,
    device,
    store,
    state,
    prefix: "footerIcon"
  });
}

export function cssStyleElementEcwidCartFooterIconSpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    prefix: "footer",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidCartFooterIconColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "footerIconColor"
  });
}

export function cssStyleElementEcwidCartFooterColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "footerColor" });
}

export function cssStyleElementEcwidCartFooterTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "footerTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartWidth({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, store, state, prefix: "cart" });
}

export function cssStyleElementEcwidCartImageWidth({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, store, state, prefix: "image" });
}

export function cssStyleElementEcwidCartImageBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, prefix: "image" });
}

export function cssStyleElementEcwidCartImageBorderRadius({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, store, state, prefix: "image" });
}

export function cssStyleElementEcwidCartImageBoxShadow({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, store, state, prefix: "image" });
}

export function cssStyleElementEcwidCartImageSpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    prefix: "image",
    direction: "right"
  });
}

export function cssStyleElementEcwidCartSummaryTitleColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "summaryTitleColor"
  });
}

export function cssStyleElementEcwidCartSummaryTitleTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "summaryTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartSummaryPriceColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "summaryPriceColor"
  });
}

export function cssStyleElementEcwidCartSummaryPriceTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "summaryPriceTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartQtyTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "qtyTypography",
    renderContext
  });
}

export function cssStylePropertyHoverTransitionElementEcwid(): string {
  return "transition-property: color, filter, box-shadow, background, border-radius, border-color;";
}

export function cssStyleElementEcwidCartCloseIconColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "closeColor" });
}

export function cssStyleElementEcwidCartCloseBgColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, store, state, prefix: "closeBg" });
}

export function cssStyleElementEcwidCartCloseBorderColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, prefix: "close" });
}

export function cssStyleElementEcwidCartCloseBorderRadiusColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, store, state, prefix: "close" });
}

export function cssStyleElementEcwidCartCloseBoxShadow({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, store, state, prefix: "close" });
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
  store,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({ v, device, store, state, prefix: "close" });
}

export function cssStyleElementEcwidCartCloseSpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    prefix: "close",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidCartCollapsedImageWidth({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    store,
    state,
    prefix: "collapsedImage"
  });
}

export function cssStyleElementEcwidCartCollapsedImageBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, prefix: "collapsedImage" });
}

export function cssStyleElementEcwidCartCollapsedImageBorderRadius({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    store,
    state,
    prefix: "collapsedImage"
  });
}

export function cssStyleElementEcwidCartCollapsedImageBoxShadow({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    store,
    state,
    prefix: "collapsedImage"
  });
}

export function cssStyleElementEcwidCartCollapsedImageSpacing({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacingWithPadding({
    v,
    device,
    store,
    state,
    prefix: "collapsedImage",
    direction: "right"
  });
}

export function cssStyleElementEcwidCartTotalProductsCountColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "cartTotalProductsCountColor"
  });
}

export function cssStyleElementEcwidCartTotalProductsCountTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "cartTotalProductsCountTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartSubtotalTitleColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "subtotalTitleColor"
  });
}

export function cssStyleElementEcwidCartSubtotalTitleTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "subtotalTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartSubtotalPriceColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "subtotalPriceColor"
  });
}

export function cssStyleElementEcwidCartSubtotalPriceTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "subtotalPriceTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartTaxesTitleColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "taxesTitleColor" });
}

export function cssStyleElementEcwidCartTaxesTitleTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "taxesTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartTaxesPriceColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "taxesPriceColor" });
}

export function cssStyleElementEcwidCartTaxesPriceTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "taxesPriceTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartSummaryNoteColor({
  v,
  device,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, store, state, prefix: "summaryNoteColor" });
}

export function cssStyleElementEcwidCartSummaryNoteTypography({
  v,
  device,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    prefix: "summaryNoteTypography",
    renderContext
  });
}
