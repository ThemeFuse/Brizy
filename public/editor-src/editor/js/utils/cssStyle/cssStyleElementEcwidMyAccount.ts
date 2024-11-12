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
  getAllCssStyleTypography
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

export function cssStyleElementEcwidMyAccountTitleTypography({
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

export function cssStyleElementEcwidMyAccountDescriptionTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
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

// Style Input
export function cssStyleElementEcwidMyAccountInputColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "inputColor" });
}

export function cssStyleElementEcwidMyAccountInputTypography({
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
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const spacingTop = dvv("descriptionSpacing");
  const spacingTopSuffix = dvv("descriptionSpacingSuffix");
  const spacingBottom = dvv("inputSpacing");
  const spacingBottomSuffix = dvv("inputSpacingSuffix");

  return `margin:${spacingTop}${spacingTopSuffix} 0 ${spacingBottom}${spacingBottomSuffix} 0;`;
}

// Style Agreement
export function cssStyleElementEcwidMyAccountAgreementColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "agreementColor" });
}

export function cssStyleElementEcwidMyAccountAgreementTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
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

export function cssStyleElementEcwidMyAccountAccountTitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
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

export function cssStyleElementEcwidMyAccountProductsTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
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

export function cssStyleElementEcwidMyAccountShopTitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
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

export function cssStyleElementEcwidMyAccountEmptyTypography({
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

export function cssStyleElementEcwidMyAccountSummaryLinkTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
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

export function cssStyleElementEcwidMyAccountConnectTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
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

export function cssStyleElementEcwidMyAccountConnectLinkTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
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

export function cssStyleElementEcwidMyAccountTitle2Typography({
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
export function cssStyleElementEcwidMyAccountButtonTypography({
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

export function cssStyleElementEcwidMyAccountFooterTypography({
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

export function cssStyleElementEcwidMyAccountBreadcrumbsAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "breadcrumbs" });
}

export function cssStyleElementEcwidMyAccountTermsColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "termsColor"
  });
}

export function cssStyleElementEcwidMyAccountTermsTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "termsTypography"
  });
}

export function cssStyleElementEcwidMyAccountTermsAlign({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const align = dvv("termsHorizontalAlign");

  return `text-align: ${align};`;
}
