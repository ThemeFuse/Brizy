import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleDisplayFlex,
  cssStyleDisplayNone,
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

export function cssStyleElementEcwidMyAccountParentBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "parentBg" });
}

export function cssStyleElementEcwidMyAccountParentBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "parent" });
}

// Style Title
export function cssStyleElementEcwidMyAccountTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "titleColor" });
}

export function cssStyleElementEcwidMyAccountTitleTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "titleTypography"
  });
}

export function cssStyleElementEcwidMyAccountTitleTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({ v, device, prefix: "titleTypography" });
}

export function cssStyleElementEcwidMyAccountTitleTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "titleTypography"
  });
}

export function cssStyleElementEcwidMyAccountTitleTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "titleTypography"
  });
}

export function cssStyleElementEcwidMyAccountTitleTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "titleTypography"
  });
}

export function cssStyleElementEcwidMyAccountTitleSpacing({
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

export function cssStyleElementEcwidMyAccountTitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "title" });
}

// Style Description
export function cssStyleElementEcwidMyAccountDescriptionColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "descriptionColor" });
}

export function cssStyleElementEcwidMyAccountDescriptionTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "descriptionTypography"
  });
}

export function cssStyleElementEcwidMyAccountDescriptionTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "descriptionTypography"
  });
}

export function cssStyleElementEcwidMyAccountDescriptionTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "descriptionTypography"
  });
}

export function cssStyleElementEcwidMyAccountDescriptionTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "descriptionTypography"
  });
}

export function cssStyleElementEcwidMyAccountDescriptionTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "descriptionTypography"
  });
}

export function cssStyleElementEcwidMyAccountDescriptionAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "description"
  });
}

export function cssStyleElementEcwidMyAccountDescriptionSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "description",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidMyAccountDescriptionSpacingTop({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "description",
    direction: "top"
  });
}

// Style Input
export function cssStyleElementEcwidMyAccountInputColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "inputColor" });
}

export function cssStyleElementEcwidMyAccountInputTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "inputTypography"
  });
}

export function cssStyleElementEcwidMyAccountInputTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({ v, device, prefix: "inputTypography" });
}

export function cssStyleElementEcwidMyAccountInputTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "inputTypography"
  });
}

export function cssStyleElementEcwidMyAccountInputTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "inputTypography"
  });
}

export function cssStyleElementEcwidMyAccountInputTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "inputTypography"
  });
}

export function cssStyleElementEcwidMyAccountInputBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidMyAccountInputHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidMyAccountInputWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidMyAccountInputBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "inputBg" });
}

export function cssStyleElementEcwidMyAccountInputBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidMyAccountInputBorderColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidMyAccountInputBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "input" });
}

export function cssStyleElementEcwidMyAccountInputSpacing({
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

// Style Agreement
export function cssStyleElementEcwidMyAccountAgreementColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "agreementColor" });
}

export function cssStyleElementEcwidMyAccountAgreementTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "agreementTypography"
  });
}

export function cssStyleElementEcwidMyAccountAgreementTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "agreementTypography"
  });
}

export function cssStyleElementEcwidMyAccountAgreementTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "agreementTypography"
  });
}

export function cssStyleElementEcwidMyAccountAgreementTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "agreementTypography"
  });
}

export function cssStyleElementEcwidMyAccountAgreementTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "agreementTypography"
  });
}

export function cssStyleElementEcwidMyAccountAgreementAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "agreement"
  });
}

export function cssStyleElementEcwidMyAccountAgreementSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "agreement",
    direction: "bottom"
  });
}

// Account Title
export function cssStyleElementEcwidMyAccountAccountTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "accountTitleColor" });
}

export function cssStyleElementEcwidMyAccountAccountTitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "accountTitle"
  });
}

export function cssStyleElementEcwidMyAccountAccountTitleTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "accountTitleTypography"
  });
}

export function cssStyleElementEcwidMyAccountAccountTitleTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "accountTitleTypography"
  });
}

export function cssStyleElementEcwidMyAccountAccountTitleTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "accountTitleTypography"
  });
}

export function cssStyleElementEcwidMyAccountAccountTitleTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "accountTitleTypography"
  });
}

export function cssStyleElementEcwidMyAccountAccountTitleTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "accountTitleTypography"
  });
}

export function cssStyleElementEcwidMyAccountAccountTitleSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "accountTitle",
    direction: "bottom"
  });
}

// Products
export function cssStyleElementEcwidMyAccountProductsColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "productsColor" });
}

export function cssStyleElementEcwidMyAccountProductsTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "productsTypography"
  });
}

export function cssStyleElementEcwidMyAccountProductsTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "productsTypography"
  });
}

export function cssStyleElementEcwidMyAccountProductsTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "productsTypography"
  });
}

export function cssStyleElementEcwidMyAccountProductsTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "productsTypography"
  });
}

export function cssStyleElementEcwidMyAccountProductsTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "productsTypography"
  });
}

// Shop Title
export function cssStyleElementEcwidMyAccountShopTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "shopTitleColor" });
}

export function cssStyleElementEcwidMyAccountShopTitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "shopTitle" });
}

export function cssStyleElementEcwidMyAccountShopTitleTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "shopTitleTypography"
  });
}

export function cssStyleElementEcwidMyAccountShopTitleTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "shopTitleTypography"
  });
}

export function cssStyleElementEcwidMyAccountShopTitleTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "shopTitleTypography"
  });
}

export function cssStyleElementEcwidMyAccountShopTitleTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "shopTitleTypography"
  });
}

export function cssStyleElementEcwidMyAccountShopTitleTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "shopTitleTypography"
  });
}

export function cssStyleElementEcwidMyAccountShopTitleSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "shopTitle",
    direction: "bottom"
  });
}

// Style Empty Cart
export function cssStyleElementEcwidMyAccountEmptyColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "emptyColor" });
}

export function cssStyleElementEcwidMyAccountEmptyTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "emptyTypography"
  });
}

export function cssStyleElementEcwidMyAccountEmptyTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "emptyTypography"
  });
}

export function cssStyleElementEcwidMyAccountEmptyTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "emptyTypography"
  });
}

export function cssStyleElementEcwidMyAccountEmptyTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "emptyTypography"
  });
}

export function cssStyleElementEcwidMyAccountEmptyTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "emptyTypography"
  });
}

export function cssStyleElementEcwidMyAccountEmptyAlign({
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

// Summary link
export function cssStyleElementEcwidMyAccountSummaryLinkColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "summaryLinkColor"
  });
}

export function cssStyleElementEcwidMyAccountSummaryLinkAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "summaryLink"
  });
}

export function cssStyleElementEcwidMyAccountSummaryLinkTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "summaryLinkTypography"
  });
}

export function cssStyleElementEcwidMyAccountSummaryLinkTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "summaryLinkTypography"
  });
}

export function cssStyleElementEcwidMyAccountSummaryLinkTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "summaryLinkTypography"
  });
}

export function cssStyleElementEcwidMyAccountSummaryLinkTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "summaryLinkTypography"
  });
}

export function cssStyleElementEcwidMyAccountSummaryLinkTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "summaryLinkTypography"
  });
}

// Connect link
export function cssStyleElementEcwidMyAccountConnectColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "connectColor" });
}

export function cssStyleElementEcwidMyAccountConnectLinkAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "connectLink"
  });
}

export function cssStyleElementEcwidMyAccountConnectTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "connectTypography"
  });
}

export function cssStyleElementEcwidMyAccountConnectTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "connectTypography"
  });
}

export function cssStyleElementEcwidMyAccountConnectTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "connectTypography"
  });
}

export function cssStyleElementEcwidMyAccountConnectTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "connectTypography"
  });
}

export function cssStyleElementEcwidMyAccountConnectTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "connectTypography"
  });
}

export function cssStyleElementEcwidMyAccountConnectLinkColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "connectLinkColor"
  });
}

export function cssStyleElementEcwidMyAccountConnectLinkTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "connectLinkTypography"
  });
}

export function cssStyleElementEcwidMyAccountConnectLinkTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "connectLinkTypography"
  });
}

export function cssStyleElementEcwidMyAccountConnectLinkTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "connectLinkTypography"
  });
}

export function cssStyleElementEcwidMyAccountConnectLinkTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "connectLinkTypography"
  });
}

export function cssStyleElementEcwidMyAccountConnectLinkTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "connectLinkTypography"
  });
}

// Style User Icon
export function cssStyleElementEcwidMyAccountUserSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({ v, device, state, prefix: "user" });
}

export function cssStyleElementEcwidMyAccountUserColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "userColor" });
}

export function cssStyleElementEcwidMyAccountUserBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "userBg" });
}

export function cssStyleElementEcwidMyAccountUserBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "user" });
}

export function cssStyleElementEcwidMyAccountUserBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "user" });
}

export function cssStyleElementEcwidMyAccountUserBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "user" });
}

export function cssStyleElementEcwidMyAccountUserBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "user" });
}

export function cssStyleElementEcwidMyAccountUserSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "user",
    direction: "right"
  });
}

// Style Title
export function cssStyleElementEcwidMyAccountTitle2Color({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "title2Color" });
}

export function cssStyleElementEcwidMyAccountTitle2TypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "title2Typography"
  });
}

export function cssStyleElementEcwidMyAccountTitle2TypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "title2Typography"
  });
}

export function cssStyleElementEcwidMyAccountTitle2TypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "title2Typography"
  });
}

export function cssStyleElementEcwidMyAccountTitle2TypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "title2Typography"
  });
}

export function cssStyleElementEcwidMyAccountTitle2TypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "title2Typography"
  });
}

export function cssStyleElementEcwidMyAccountTitle2Align({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "title2" });
}

export function cssStyleElementEcwidMyAccountTitle2Spacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "title2",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidMyAccountInputPlaceholderDisplay({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const placeholder = dvv("placeholder");

  return placeholder === "off" ? cssStyleDisplayNone() : cssStyleDisplayFlex();
}

// Style Button
export function cssStyleElementEcwidMyAccountButtonTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "buttonTypography"
  });
}

export function cssStyleElementEcwidMyAccountButtonTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({ v, device, prefix: "buttonTypography" });
}

export function cssStyleElementEcwidMyAccountButtonTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "buttonTypography"
  });
}

export function cssStyleElementEcwidMyAccountButtonTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "buttonTypography"
  });
}

export function cssStyleElementEcwidMyAccountButtonTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "buttonTypography"
  });
}

export function cssStyleElementEcwidMyAccountButtonSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidMyAccountButtonWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidMyAccountButtonColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "buttonColor" });
}

export function cssStyleElementEcwidMyAccountButtonBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "buttonBg" });
}

export function cssStyleElementEcwidMyAccountButtonBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidMyAccountButtonBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidMyAccountButtonBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidMyAccountButtonBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "button" });
}

export function cssStyleElementEcwidMyAccountButtonAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "button" });
}

// Style Footer
export function cssStyleElementEcwidMyAccountFooterIconSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({ v, device, state, prefix: "footerIcon" });
}

export function cssStyleElementEcwidMyAccountFooterIconSpacing({
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

export function cssStyleElementEcwidMyAccountFooterIconColor({
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

export function cssStyleElementEcwidMyAccountFooterColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "footerColor" });
}

export function cssStyleElementEcwidMyAccountFooterTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "footerTypography"
  });
}

export function cssStyleElementEcwidMyAccountFooterTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({ v, device, prefix: "footerTypography" });
}

export function cssStyleElementEcwidMyAccountFooterTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "footerTypography"
  });
}

export function cssStyleElementEcwidMyAccountFooterTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "footerTypography"
  });
}

export function cssStyleElementEcwidMyAccountFooterTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "footerTypography"
  });
}
