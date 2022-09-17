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
  cssStyleTextAlign,
  cssStyleTypography3FontFamily,
  cssStyleTypography3FontSize,
  cssStyleTypography3FontWeight,
  cssStyleTypography3LetterSpacing,
  cssStyleTypography3LineHeight
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";
import { styleColor } from "../style2/styleColor";

// Style Title
export function cssStyleElementEcwidCartTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "titleColor" });
}

export function cssStyleElementEcwidCartTitleTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "titleTypography"
  });
}

export function cssStyleElementEcwidCartTitleTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({ v, device, prefix: "titleTypography" });
}

export function cssStyleElementEcwidCartTitleTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "titleTypography"
  });
}

export function cssStyleElementEcwidCartTitleTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "titleTypography"
  });
}

export function cssStyleElementEcwidCartTitleTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartTitle2TypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "title2Typography"
  });
}

export function cssStyleElementEcwidCartTitle2TypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({ v, device, prefix: "title2Typography" });
}

export function cssStyleElementEcwidCartTitle2TypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "title2Typography"
  });
}

export function cssStyleElementEcwidCartTitle2TypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "title2Typography"
  });
}

export function cssStyleElementEcwidCartTitle2TypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartSubtitleTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "subtitleTypography"
  });
}

export function cssStyleElementEcwidCartSubtitleTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "subtitleTypography"
  });
}

export function cssStyleElementEcwidCartSubtitleTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "subtitleTypography"
  });
}

export function cssStyleElementEcwidCartSubtitleTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "subtitleTypography"
  });
}

export function cssStyleElementEcwidCartSubtitleTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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
export function cssStyleElementEcwidCartButtonTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "buttonTypography"
  });
}

export function cssStyleElementEcwidCartButtonTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({ v, device, prefix: "buttonTypography" });
}

export function cssStyleElementEcwidCartButtonTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "buttonTypography"
  });
}

export function cssStyleElementEcwidCartButtonTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "buttonTypography"
  });
}

export function cssStyleElementEcwidCartButtonTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartEmailTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "emailTypography"
  });
}

export function cssStyleElementEcwidCartEmailTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({ v, device, prefix: "emailTypography" });
}

export function cssStyleElementEcwidCartEmailTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "emailTypography"
  });
}

export function cssStyleElementEcwidCartEmailTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "emailTypography"
  });
}

export function cssStyleElementEcwidCartEmailTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartCheckboxTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "checkboxTypography"
  });
}

export function cssStyleElementEcwidCartCheckboxTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "checkboxTypography"
  });
}

export function cssStyleElementEcwidCartCheckboxTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "checkboxTypography"
  });
}

export function cssStyleElementEcwidCartCheckboxTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "checkboxTypography"
  });
}

export function cssStyleElementEcwidCartCheckboxTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartNextTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({ v, device, prefix: "nextTypography" });
}

export function cssStyleElementEcwidCartNextTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({ v, device, prefix: "nextTypography" });
}

export function cssStyleElementEcwidCartNextTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({ v, device, prefix: "nextTypography" });
}

export function cssStyleElementEcwidCartNextTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({ v, device, prefix: "nextTypography" });
}

export function cssStyleElementEcwidCartNextTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartPaymentTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "paymentTypography"
  });
}

export function cssStyleElementEcwidCartPaymentTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "paymentTypography"
  });
}

export function cssStyleElementEcwidCartPaymentTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "paymentTypography"
  });
}

export function cssStyleElementEcwidCartPaymentTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "paymentTypography"
  });
}

export function cssStyleElementEcwidCartPaymentTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartInputTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "inputTypography"
  });
}

export function cssStyleElementEcwidCartInputTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({ v, device, prefix: "inputTypography" });
}

export function cssStyleElementEcwidCartInputTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "inputTypography"
  });
}

export function cssStyleElementEcwidCartInputTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "inputTypography"
  });
}

export function cssStyleElementEcwidCartInputTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartProductNameTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "productNameTypography"
  });
}

export function cssStyleElementEcwidCartProductNameTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "productNameTypography"
  });
}

export function cssStyleElementEcwidCartProductNameTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "productNameTypography"
  });
}

export function cssStyleElementEcwidCartProductNameTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "productNameTypography"
  });
}

export function cssStyleElementEcwidCartProductNameTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartProductSizeTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "productSizeTypography"
  });
}

export function cssStyleElementEcwidCartProductSizeTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "productSizeTypography"
  });
}

export function cssStyleElementEcwidCartProductSizeTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "productSizeTypography"
  });
}

export function cssStyleElementEcwidCartProductSizeTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "productSizeTypography"
  });
}

export function cssStyleElementEcwidCartProductSizeTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartEmptyTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "emptyTypography"
  });
}

export function cssStyleElementEcwidCartEmptyTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "emptyTypography"
  });
}

export function cssStyleElementEcwidCartEmptyTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "emptyTypography"
  });
}

export function cssStyleElementEcwidCartEmptyTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "emptyTypography"
  });
}

export function cssStyleElementEcwidCartEmptyTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartFooterTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "footerTypography"
  });
}

export function cssStyleElementEcwidCartFooterTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({ v, device, prefix: "footerTypography" });
}

export function cssStyleElementEcwidCartFooterTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "footerTypography"
  });
}

export function cssStyleElementEcwidCartFooterTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "footerTypography"
  });
}

export function cssStyleElementEcwidCartFooterTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartSummaryTitleTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "summaryTitleTypography"
  });
}

export function cssStyleElementEcwidCartSummaryTitleTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "summaryTitleTypography"
  });
}

export function cssStyleElementEcwidCartSummaryTitleTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "summaryTitleTypography"
  });
}

export function cssStyleElementEcwidCartSummaryTitleTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "summaryTitleTypography"
  });
}

export function cssStyleElementEcwidCartSummaryTitleTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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

export function cssStyleElementEcwidCartSummaryPriceTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "summaryPriceTypography"
  });
}

export function cssStyleElementEcwidCartSummaryPriceTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "summaryPriceTypography"
  });
}

export function cssStyleElementEcwidCartSummaryPriceTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "summaryPriceTypography"
  });
}

export function cssStyleElementEcwidCartSummaryPriceTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "summaryPriceTypography"
  });
}

export function cssStyleElementEcwidCartSummaryPriceTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "summaryPriceTypography"
  });
}

export function cssStyleElementEcwidCartQtyTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "qtyTypography"
  });
}

export function cssStyleElementEcwidCartQtyTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "qtyTypography"
  });
}

export function cssStyleElementEcwidCartQtyTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "qtyTypography"
  });
}

export function cssStyleElementEcwidCartQtyTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "qtyTypography"
  });
}

export function cssStyleElementEcwidCartQtyTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
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
