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
import { ACTIVE } from "visual/utils/stateMode";
import { styleAlignHorizontal } from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";
import { styleColor } from "../style2/styleColor";

export function cssStyleElementEcwidCartParentBgColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "parentBg"
  });
}

export function cssStyleElementEcwidCartParentBgGradient({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "parent"
  });
}

// Style Title
export function cssStyleElementEcwidCartTitleColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "titleColor"
  });
}

export function cssStyleElementEcwidCartTitleTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "titleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartTitleAlign({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "title"
  });
}

export function cssStyleElementEcwidCartTitleSpacing({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "title",
    direction: "bottom"
  });
}

// Style Title2
export function cssStyleElementEcwidCartTitle2Color({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "title2Color"
  });
}

export function cssStyleElementEcwidCartTitle2Typography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "title2Typography",
    renderContext
  });
}

export function cssStyleElementEcwidCartTitle2Align({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "title2"
  });
}

// Style Subtitle
export function cssStyleElementEcwidCartSubtitleColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "subtitleColor"
  });
}

export function cssStyleElementEcwidCartSubtitleTypography({
  v,
  device,
  store,
  getConfig,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "subtitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartSubtitleAlign({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "subtitle"
  });
}

export function cssStyleElementEcwidCartSubtitleSpacing({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    getConfig,
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
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "buttonTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartButtonSize({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSizePadding({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonWidth({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "buttonColor"
  });
}

export function cssStyleElementEcwidCartButtonBgColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "buttonBg"
  });
}

export function cssStyleElementEcwidCartButtonBgGradient({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonBorder({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonBorderRadius({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonBoxShadow({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonAlign({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementEcwidCartButtonAlignVertically({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  const alignItems = readHorizontalAlign(
    styleAlignHorizontal({
      v,
      device,
      state,
      store,
      getConfig,
      prefix: "button"
    })
  );

  return alignItems ? `align-items:${FlexHorizontalAligns[alignItems]};` : "";
}

export function cssStyleElementEcwidCartButtonSpacing({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "button",
    direction: "bottom"
  });
}

// Style Email
export function cssStyleElementEcwidCartEmailColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "emailColor"
  });
}

export function cssStyleElementEcwidCartEmailTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "emailTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartEmailAlign({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "email"
  });
}

export function cssStyleElementEcwidCartEmailSpacing({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "email",
    direction: "bottom"
  });
}

// Style Checkbox
export function cssStyleElementEcwidCartCheckboxColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "checkboxColor"
  });
}

export function cssStyleElementEcwidCartCheckboxTypography({
  v,
  device,
  store,
  getConfig,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "checkboxTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartCheckboxSpacing({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "checkbox",
    direction: "bottom"
  });
}

// Style Next
export function cssStyleElementEcwidCartNextColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "nextColor"
  });
}

export function cssStyleElementEcwidCartNextTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "nextTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartNextAlign({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "next"
  });
}

// Style Payment
export function cssStyleElementEcwidCartPaymentColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "paymentColor"
  });
}

export function cssStyleElementEcwidCartPaymentTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "paymentTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartPaymentAlign({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "payment"
  });
}

// Style Input
export function cssStyleElementEcwidCartInputColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "inputColor"
  });
}

export function cssStyleElementEcwidCartInputColorAutofill({
  v,
  device,
  state,
  getConfig
}: CSSValue): string {
  const color = styleColor({
    v,
    device,
    state,
    getConfig,
    prefix: "inputColor"
  });

  return `-webkit-text-fill-color:${color}!important`;
}

export function cssStyleElementEcwidCartInputTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "inputTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartInputBorderRadius({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "input"
  });
}

export function cssStyleElementEcwidCartInputHeight({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementEcwidCartInputWidth({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementEcwidCartInputBgColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "inputBg"
  });
}

export function cssStyleElementEcwidCartInputBgGradient({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementEcwidCartInputBorderColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementEcwidCartInputBoxShadow({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "input"
  });
}

export function cssStyleElementEcwidCartInputSpacing({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "input",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidCartInputAlign({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "input"
  });
}

// Style Product Name
export function cssStyleElementEcwidCartProductNameColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "productNameColor"
  });
}

export function cssStyleElementEcwidCartProductNameTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "productNameTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartProductNameAlign({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "productName"
  });
}

// Style Product Size
export function cssStyleElementEcwidCartProductSizeColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "productSizeColor"
  });
}

export function cssStyleElementEcwidCartProductSizeTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "productSizeTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartProductSizeAlign({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    getConfig,
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
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    getConfig,
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
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "emptyTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartEmptyAlign({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "empty"
  });
}

export function cssStyleElementEcwidCartEmptySpacing({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "empty",
    direction: "bottom"
  });
}

// Style Footer
export function cssStyleElementEcwidCartFooterIconSize({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "footerIcon"
  });
}

export function cssStyleElementEcwidCartFooterIconSpacing({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "footer",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidCartFooterIconColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "footerIconColor"
  });
}

export function cssStyleElementEcwidCartFooterColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "footerColor"
  });
}

export function cssStyleElementEcwidCartFooterTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "footerTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartWidth({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "cart"
  });
}

export function cssStyleElementEcwidCartImageWidth({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "image"
  });
}

export function cssStyleElementEcwidCartImageBorder({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "image"
  });
}

export function cssStyleElementEcwidCartImageBorderRadius({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "image"
  });
}

export function cssStyleElementEcwidCartImageBoxShadow({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "image"
  });
}

export function cssStyleElementEcwidCartImageSpacing({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "image",
    direction: "right"
  });
}

export function cssStyleElementEcwidCartSummaryTitleColor({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "summaryTitleColor"
  });
}

export function cssStyleElementEcwidCartSummaryTitleTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "summaryTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartSummaryPriceColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "summaryPriceColor"
  });
}

export function cssStyleElementEcwidCartSummaryPriceTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "summaryPriceTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartQtyTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
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
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "closeColor"
  });
}

export function cssStyleElementEcwidCartCloseBgColor({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "closeBg"
  });
}

export function cssStyleElementEcwidCartCloseBorderColor({
  v,
  device,
  getConfig,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "close"
  });
}

export function cssStyleElementEcwidCartCloseBorderRadiusColor({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "close"
  });
}

export function cssStyleElementEcwidCartCloseBoxShadow({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "close"
  });
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
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "close"
  });
}

export function cssStyleElementEcwidCartCloseSpacing({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "close",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidCartCollapsedImageWidth({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "collapsedImage"
  });
}

export function cssStyleElementEcwidCartCollapsedImageBorder({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "collapsedImage"
  });
}

export function cssStyleElementEcwidCartCollapsedImageBorderRadius({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "collapsedImage"
  });
}

export function cssStyleElementEcwidCartCollapsedImageBoxShadow({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "collapsedImage"
  });
}

export function cssStyleElementEcwidCartCollapsedImageSpacing({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleSpacingWithPadding({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "collapsedImage",
    direction: "right"
  });
}

export function cssStyleElementEcwidCartTotalProductsCountColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "cartTotalProductsCountColor"
  });
}

export function cssStyleElementEcwidCartTotalProductsCountTypography({
  v,
  device,
  store,
  getConfig,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "cartTotalProductsCountTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartSubtotalTitleColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "subtotalTitleColor"
  });
}

export function cssStyleElementEcwidCartSubtotalTitleTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "subtotalTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartSubtotalPriceColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "subtotalPriceColor"
  });
}

export function cssStyleElementEcwidCartSubtotalPriceTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "subtotalPriceTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartTaxesTitleColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "taxesTitleColor"
  });
}

export function cssStyleElementEcwidCartTaxesTitleTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "taxesTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartTaxesPriceColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "taxesPriceColor"
  });
}

export function cssStyleElementEcwidCartTaxesPriceTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "taxesPriceTypography",
    renderContext
  });
}

export function cssStyleElementEcwidCartSummaryNoteColor({
  v,
  device,
  store,
  getConfig,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "summaryNoteColor"
  });
}

export function cssStyleElementEcwidCartSummaryNoteTypography({
  v,
  device,
  store,
  state,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "summaryNoteTypography",
    renderContext
  });
}

export const cssStyleElementEcwidCartRadioBorder = (data: CSSValue): string =>
  cssStyleBorder({ ...data, prefix: "radio" });

export const cssStyleElementEcwidCartRadioActiveBorder = (
  data: CSSValue
): string => cssStyleBorder({ ...data, state: ACTIVE, prefix: "radio" });
