import { renderStyles } from "visual/utils/cssStyle";
import { ElementModel } from "visual/component/Elements/Types";

export function style(
  v: ElementModel,
  vs: ElementModel,
  vd: ElementModel
): [string, string, string] {
  const styles = {
    // Style Footer
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer": {
      standart: ["cssStyleElementEcwidMyAccountFooterDisplay"]
    },
    ".brz &&:hover .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--my-account:hover": {
      standart: [
        "cssStyleElementEcwidMyAccountSignInLinkDisplay",
        "cssStyleElementEcwidMyAccountFooterColor",
        "cssStyleElementEcwidMyAccountFooterTypography2FontFamily",
        "cssStyleElementEcwidMyAccountFooterTypography2FontSize",
        "cssStyleElementEcwidMyAccountFooterTypography2LineHeight",
        "cssStyleElementEcwidMyAccountFooterTypography2FontWeight",
        "cssStyleElementEcwidMyAccountFooterTypography2LetterSpacing"
      ]
    },
    ".brz &&:hover .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--track-order:hover": {
      standart: [
        "cssStyleElementEcwidMyAccountSignInLinkDisplay",
        "cssStyleElementEcwidMyAccountFooterColor",
        "cssStyleElementEcwidMyAccountFooterTypography2FontFamily",
        "cssStyleElementEcwidMyAccountFooterTypography2FontSize",
        "cssStyleElementEcwidMyAccountFooterTypography2LineHeight",
        "cssStyleElementEcwidMyAccountFooterTypography2FontWeight",
        "cssStyleElementEcwidMyAccountFooterTypography2LetterSpacing"
      ]
    },
    ".brz &&:hover .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--shopping-cart:hover": {
      standart: [
        "cssStyleElementEcwidMyAccountFooterColor",
        "cssStyleElementEcwidMyAccountFooterTypography2FontFamily",
        "cssStyleElementEcwidMyAccountFooterTypography2FontSize",
        "cssStyleElementEcwidMyAccountFooterTypography2LineHeight",
        "cssStyleElementEcwidMyAccountFooterTypography2FontWeight",
        "cssStyleElementEcwidMyAccountFooterTypography2LetterSpacing"
      ]
    },
    // Style Title
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name.ec-header-h1": {
      standart: [
        "cssStyleElementEcwidMyAccountTitleColor",
        "cssStyleElementEcwidMyAccountTitleTypography2FontFamily",
        "cssStyleElementEcwidMyAccountTitleTypography2FontSize",
        "cssStyleElementEcwidMyAccountTitleTypography2LineHeight",
        "cssStyleElementEcwidMyAccountTitleTypography2FontWeight",
        "cssStyleElementEcwidMyAccountTitleTypography2LetterSpacing",
        "cssStyleElementEcwidMyAccountTitleAlign"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name": {
      standart: [
        "cssStyleElementEcwidMyAccountTitleColor",
        "cssStyleElementEcwidMyAccountTitleTypography2FontFamily",
        "cssStyleElementEcwidMyAccountTitleTypography2FontSize",
        "cssStyleElementEcwidMyAccountTitleTypography2LineHeight",
        "cssStyleElementEcwidMyAccountTitleTypography2FontWeight",
        "cssStyleElementEcwidMyAccountTitleTypography2LetterSpacing",
        "cssStyleElementEcwidMyAccountTitleAlign"
      ]
    },
    // Style Description
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__text": {
      standart: [
        "cssStyleElementEcwidMyAccountDescriptionColor",
        "cssStyleElementEcwidMyAccountDescriptionTypography2FontFamily",
        "cssStyleElementEcwidMyAccountDescriptionTypography2FontSize",
        "cssStyleElementEcwidMyAccountDescriptionTypography2LineHeight",
        "cssStyleElementEcwidMyAccountDescriptionTypography2FontWeight",
        "cssStyleElementEcwidMyAccountDescriptionTypography2LetterSpacing",
        "cssStyleElementEcwidMyAccountDescriptionAlign"
      ]
    },
    // Style Input Email
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control": {
      standart: ["cssStyleElementEcwidMyAccountInputColor"]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control input#ec-signin-email-input": {
      standart: [
        "cssStyleElementEcwidMyAccountInputTypography2FontFamily",
        "cssStyleElementEcwidMyAccountInputTypography2FontSize",
        "cssStyleElementEcwidMyAccountInputTypography2LineHeight",
        "cssStyleElementEcwidMyAccountInputTypography2FontWeight",
        "cssStyleElementEcwidMyAccountInputTypography2LetterSpacing",
        "cssStyleElementEcwidMyAccountInputSize",
        "cssStyleElementEcwidMyAccountInputBorderRadius",
        "cssStyleElementEcwidMyAccountInputBgColor",
        "cssStyleElementEcwidMyAccountInputBorderColor",
        "cssStyleElementEcwidMyAccountInputBoxShadow"
      ]
    },
    // Style Agreement
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart__checkout .ec-cart__agreement": {
      standart: [
        "cssStyleElementEcwidMyAccountAgreementColor",
        "cssStyleElementEcwidMyAccountAgreementTypography2FontFamily",
        "cssStyleElementEcwidMyAccountAgreementTypography2FontSize",
        "cssStyleElementEcwidMyAccountAgreementTypography2LineHeight",
        "cssStyleElementEcwidMyAccountAgreementTypography2FontWeight",
        "cssStyleElementEcwidMyAccountAgreementTypography2LetterSpacing",
        "cssStyleElementEcwidMyAccountAgreementAlign"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles }) as [string, string, string];
}
