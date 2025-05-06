import { WithRenderContext } from "visual/providers/RenderProvider";
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

export function cssStyleElementEcwidMyAccountParentBgGradient({
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
export function cssStyleElementEcwidMyAccountTitleColor({
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

export function cssStyleElementEcwidMyAccountTitleTypography({
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

export function cssStyleElementEcwidMyAccountTitleSpacing({
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

export function cssStyleElementEcwidMyAccountTitleAlign({
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

// Style Description
export function cssStyleElementEcwidMyAccountDescriptionColor({
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
    prefix: "descriptionColor"
  });
}

export function cssStyleElementEcwidMyAccountDescriptionTypography({
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
    prefix: "descriptionTypography",
    renderContext
  });
}

export function cssStyleElementEcwidMyAccountDescriptionAlign({
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
    prefix: "description"
  });
}

export function cssStyleElementEcwidMyAccountDescriptionSpacing({
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
    prefix: "description",
    direction: "bottom"
  });
}

// Style Input
export function cssStyleElementEcwidMyAccountInputColor({
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

export function cssStyleElementEcwidMyAccountInputTypography({
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
    prefix: "inputTypography",
    renderContext
  });
}

export function cssStyleElementEcwidMyAccountInputBorderRadius({
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
    prefix: "input"
  });
}

export function cssStyleElementEcwidMyAccountInputHeight({
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

export function cssStyleElementEcwidMyAccountInputWidth({
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

export function cssStyleElementEcwidMyAccountInputBgColor({
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

export function cssStyleElementEcwidMyAccountInputBgGradient({
  v,
  device,
  getConfig,
  store,
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

export function cssStyleElementEcwidMyAccountInputBorderColor({
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

export function cssStyleElementEcwidMyAccountInputBoxShadow({
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
    prefix: "agreementColor"
  });
}

export function cssStyleElementEcwidMyAccountAgreementTypography({
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
    getConfig,
    state,
    prefix: "agreementTypography",
    renderContext
  });
}

export function cssStyleElementEcwidMyAccountAgreementAlign({
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
    prefix: "agreement"
  });
}

export function cssStyleElementEcwidMyAccountAgreementSpacing({
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
    prefix: "agreement",
    direction: "bottom"
  });
}

// Account Title
export function cssStyleElementEcwidMyAccountAccountTitleColor({
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
    prefix: "accountTitleColor"
  });
}

export function cssStyleElementEcwidMyAccountAccountTitleAlign({
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
    prefix: "accountTitle"
  });
}

export function cssStyleElementEcwidMyAccountAccountTitleTypography({
  v,
  device,
  getConfig,
  store,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    getConfig,
    store,
    state,
    prefix: "accountTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidMyAccountAccountTitleSpacing({
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
    getConfig,
    state,
    prefix: "accountTitle",
    direction: "bottom"
  });
}

// Products
export function cssStyleElementEcwidMyAccountProductsColor({
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
    prefix: "productsColor"
  });
}

export function cssStyleElementEcwidMyAccountProductsTypography({
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
    prefix: "productsTypography",
    renderContext
  });
}

// Shop Title
export function cssStyleElementEcwidMyAccountShopTitleColor({
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
    prefix: "shopTitleColor"
  });
}

export function cssStyleElementEcwidMyAccountShopTitleAlign({
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
    prefix: "shopTitle"
  });
}

export function cssStyleElementEcwidMyAccountShopTitleTypography({
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
    prefix: "shopTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidMyAccountShopTitleSpacing({
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
    getConfig,
    state,
    prefix: "shopTitle",
    direction: "bottom"
  });
}

// Style Empty Cart
export function cssStyleElementEcwidMyAccountEmptyColor({
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
    prefix: "emptyColor"
  });
}

export function cssStyleElementEcwidMyAccountEmptyTypography({
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
    getConfig,
    state,
    prefix: "emptyTypography",
    renderContext
  });
}

export function cssStyleElementEcwidMyAccountEmptyAlign({
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

// Summary link
export function cssStyleElementEcwidMyAccountSummaryLinkColor({
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
    prefix: "summaryLinkColor"
  });
}

export function cssStyleElementEcwidMyAccountSummaryLinkAlign({
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
    prefix: "summaryLink"
  });
}

export function cssStyleElementEcwidMyAccountSummaryLinkTypography({
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
    getConfig,
    state,
    prefix: "summaryLinkTypography",
    renderContext
  });
}

// Connect link
export function cssStyleElementEcwidMyAccountConnectColor({
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
    prefix: "connectColor"
  });
}

export function cssStyleElementEcwidMyAccountConnectLinkAlign({
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
    prefix: "connectLink"
  });
}

export function cssStyleElementEcwidMyAccountConnectTypography({
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
    prefix: "connectTypography",
    renderContext
  });
}

export function cssStyleElementEcwidMyAccountConnectLinkColor({
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
    prefix: "connectLinkColor"
  });
}

export function cssStyleElementEcwidMyAccountConnectLinkTypography({
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
    getConfig,
    state,
    prefix: "connectLinkTypography",
    renderContext
  });
}

// Style User Icon
export function cssStyleElementEcwidMyAccountUserSize({
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
    prefix: "user"
  });
}

export function cssStyleElementEcwidMyAccountUserColor({
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
    prefix: "userColor"
  });
}

export function cssStyleElementEcwidMyAccountUserBgColor({
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
    prefix: "userBg"
  });
}

export function cssStyleElementEcwidMyAccountUserBgGradient({
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
    prefix: "user"
  });
}

export function cssStyleElementEcwidMyAccountUserBorder({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, getConfig, prefix: "user" });
}

export function cssStyleElementEcwidMyAccountUserBoxShadow({
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
    prefix: "user"
  });
}

export function cssStyleElementEcwidMyAccountUserBorderRadius({
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
    prefix: "user"
  });
}

export function cssStyleElementEcwidMyAccountUserSpacing({
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
    prefix: "user",
    direction: "right"
  });
}

// Style Title
export function cssStyleElementEcwidMyAccountTitle2Color({
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
    prefix: "title2Color"
  });
}

export function cssStyleElementEcwidMyAccountTitle2Typography({
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

export function cssStyleElementEcwidMyAccountTitle2Align({
  v,
  device,
  getConfig,
  store,
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

export function cssStyleElementEcwidMyAccountTitle2Spacing({
  v,
  device,
  getConfig,
  store,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    store,
    getConfig,
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
    prefix: "buttonTypography",
    renderContext
  });
}

export function cssStyleElementEcwidMyAccountButtonSize({
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

export function cssStyleElementEcwidMyAccountButtonWidth({
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
    prefix: "button"
  });
}

export function cssStyleElementEcwidMyAccountButtonColor({
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
    prefix: "buttonColor"
  });
}

export function cssStyleElementEcwidMyAccountButtonBgColor({
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
    prefix: "buttonBg"
  });
}

export function cssStyleElementEcwidMyAccountButtonBgGradient({
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

export function cssStyleElementEcwidMyAccountButtonBorder({
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

export function cssStyleElementEcwidMyAccountButtonBorderRadius({
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

export function cssStyleElementEcwidMyAccountButtonBoxShadow({
  v,
  device,
  getConfig,
  store,
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

export function cssStyleElementEcwidMyAccountButtonAlign({
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
    getConfig,
    state,
    prefix: "button"
  });
}

// Style Footer
export function cssStyleElementEcwidMyAccountFooterIconSize({
  v,
  device,
  getConfig,
  store,
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

export function cssStyleElementEcwidMyAccountFooterIconSpacing({
  v,
  device,
  getConfig,
  store,
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

export function cssStyleElementEcwidMyAccountFooterIconColor({
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
    prefix: "footerIconColor"
  });
}

export function cssStyleElementEcwidMyAccountFooterColor({
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

export function cssStyleElementEcwidMyAccountFooterTypography({
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
    getConfig,
    state,
    prefix: "footerTypography",
    renderContext
  });
}

export function cssStyleElementEcwidMyAccountTermsColor({
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
    prefix: "termsColor"
  });
}

export function cssStyleElementEcwidMyAccountTermsTypography({
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
    getConfig,
    store,
    state,
    prefix: "termsTypography",
    renderContext
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
