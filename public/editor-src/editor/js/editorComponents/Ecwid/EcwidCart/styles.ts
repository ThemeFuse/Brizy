import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./index";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    // Style Footer
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer": {
      standart: ["cssStyleElementEcwidCartFooterDisplay"]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--my-account:hover": {
      standart: [
        "cssStyleElementEcwidCartSignInLinkDisplay",
        "cssStyleElementEcwidCartFooterColor",
        "cssStyleElementEcwidCartFooterTypography2FontFamily",
        "cssStyleElementEcwidCartFooterTypography2FontSize",
        "cssStyleElementEcwidCartFooterTypography2LineHeight",
        "cssStyleElementEcwidCartFooterTypography2FontWeight",
        "cssStyleElementEcwidCartFooterTypography2LetterSpacing"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--track-order:hover": {
      standart: [
        "cssStyleElementEcwidCartSignInLinkDisplay",
        "cssStyleElementEcwidCartFooterColor",
        "cssStyleElementEcwidCartFooterTypography2FontFamily",
        "cssStyleElementEcwidCartFooterTypography2FontSize",
        "cssStyleElementEcwidCartFooterTypography2LineHeight",
        "cssStyleElementEcwidCartFooterTypography2FontWeight",
        "cssStyleElementEcwidCartFooterTypography2LetterSpacing"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--shopping-cart:hover": {
      standart: [
        "cssStyleElementEcwidCartFooterColor",
        "cssStyleElementEcwidCartFooterTypography2FontFamily",
        "cssStyleElementEcwidCartFooterTypography2FontSize",
        "cssStyleElementEcwidCartFooterTypography2LineHeight",
        "cssStyleElementEcwidCartFooterTypography2FontWeight",
        "cssStyleElementEcwidCartFooterTypography2LetterSpacing"
      ]
    },
    //Style Titles
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name.ec-header-h1": {
      standart: [
        "cssStyleElementEcwidCartTitleColor",
        "cssStyleElementEcwidCartTitleTypography2FontFamily",
        "cssStyleElementEcwidCartTitleTypography2FontSize",
        "cssStyleElementEcwidCartTitleTypography2LineHeight",
        "cssStyleElementEcwidCartTitleTypography2FontWeight",
        "cssStyleElementEcwidCartTitleTypography2LetterSpacing",
        "cssStyleElementEcwidCartTitleAlign"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name": {
      standart: [
        "cssStyleElementEcwidCartTitle2Color",
        "cssStyleElementEcwidCartTitle2Typography2FontFamily",
        "cssStyleElementEcwidCartTitle2Typography2FontSize",
        "cssStyleElementEcwidCartTitle2Typography2LineHeight",
        "cssStyleElementEcwidCartTitle2Typography2FontWeight",
        "cssStyleElementEcwidCartTitle2Typography2LetterSpacing",
        "cssStyleElementEcwidCartTitle2Align"
      ]
    },
    // Style Subtitle
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__cert": {
      standart: [
        "cssStyleElementEcwidCartSubtitleColor",
        "cssStyleElementEcwidCartSubtitleTypography2FontFamily",
        "cssStyleElementEcwidCartSubtitleTypography2FontSize",
        "cssStyleElementEcwidCartSubtitleTypography2LineHeight",
        "cssStyleElementEcwidCartSubtitleTypography2FontWeight",
        "cssStyleElementEcwidCartSubtitleTypography2LetterSpacing",
        "cssStyleElementEcwidCartSubtitleAlign"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--payment .ec-cart-next__text": {
      standart: [
        "cssStyleElementEcwidCartSubtitleColor",
        "cssStyleElementEcwidCartSubtitleTypography2FontFamily",
        "cssStyleElementEcwidCartSubtitleTypography2FontSize",
        "cssStyleElementEcwidCartSubtitleTypography2LineHeight",
        "cssStyleElementEcwidCartSubtitleTypography2FontWeight",
        "cssStyleElementEcwidCartSubtitleTypography2LetterSpacing",
        "cssStyleElementEcwidCartSubtitleAlign"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--order-confirmation .ec-cart-next__text": {
      standart: [
        "cssStyleElementEcwidCartSubtitleColor",
        "cssStyleElementEcwidCartSubtitleTypography2FontFamily",
        "cssStyleElementEcwidCartSubtitleTypography2FontSize",
        "cssStyleElementEcwidCartSubtitleTypography2LineHeight",
        "cssStyleElementEcwidCartSubtitleTypography2FontWeight",
        "cssStyleElementEcwidCartSubtitleTypography2LetterSpacing",
        "cssStyleElementEcwidCartSubtitleAlign"
      ]
    },
    //Style Link
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count .form-control--select-inline": {
      standart: [
        "cssStyleElementEcwidCartLinkColor",
        "cssStyleElementEcwidCartLinkTypography2FontFamily",
        "cssStyleElementEcwidCartLinkTypography2FontSize",
        "cssStyleElementEcwidCartLinkTypography2LineHeight",
        "cssStyleElementEcwidCartLinkTypography2FontWeight",
        "cssStyleElementEcwidCartLinkTypography2LetterSpacing",
        "cssStyleElementEcwidCartLinkAlign"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count .form-control--select-inline .form-control__select option": {
      standart: [
        "cssStyleElementEcwidCartLinkColor",
        "cssStyleElementEcwidCartLinkTypography2FontFamily",
        "cssStyleElementEcwidCartLinkTypography2FontSize",
        "cssStyleElementEcwidCartLinkTypography2LineHeight",
        "cssStyleElementEcwidCartLinkTypography2FontWeight",
        "cssStyleElementEcwidCartLinkTypography2LetterSpacing",
        "cssStyleElementEcwidCartLinkAlign"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products ....ec-cart__products-inner .ec-cart__item .ec-cart-item-sum .ec-cart-item-sum.ec-cart-item-sum--items .form-control .form-control__select-text": {
      standart: [
        "cssStyleElementEcwidCartLinkColor",
        "cssStyleElementEcwidCartLinkTypography2FontFamily",
        "cssStyleElementEcwidCartLinkTypography2FontSize",
        "cssStyleElementEcwidCartLinkTypography2LineHeight",
        "cssStyleElementEcwidCartLinkTypography2FontWeight",
        "cssStyleElementEcwidCartLinkTypography2LetterSpacing",
        "cssStyleElementEcwidCartLinkAlign"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__shopping.ec-cart-shopping .ec-cart-shopping__wrap .ec-link": {
      standart: [
        "cssStyleElementEcwidCartLinkColor",
        "cssStyleElementEcwidCartLinkTypography2FontFamily",
        "cssStyleElementEcwidCartLinkTypography2FontSize",
        "cssStyleElementEcwidCartLinkTypography2LineHeight",
        "cssStyleElementEcwidCartLinkTypography2FontWeight",
        "cssStyleElementEcwidCartLinkTypography2LetterSpacing",
        "cssStyleElementEcwidCartLinkAlign"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__control .ec-cart-item__control-inner": {
      standart: ["cssStyleElementEcwidCartLinkColor"]
    },
    // Style button
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons div .form-control .form-control__button:hover": {
      standart: [
        "cssStyleElementEcwidCartButtonColor",
        "cssStyleBgColorImportant",
        "cssStyleElementEcwidCartButtonBgGradient",
        "cssStyleBorderImportant",
        "cssStyleBoxShadowImportant",
        "cssStyleElementEcwidCartButtonBorderRadius",
        "cssStyleElementEcwidCartButtonSize"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__button. form-control .form-control__button:hover": {
      standart: [
        "cssStyleElementEcwidCartButtonColor",
        "cssStyleBgColorImportant",
        "cssStyleElementEcwidCartButtonBgGradient",
        "cssStyleBorderImportant",
        "cssStyleBoxShadowImportant",
        "cssStyleElementEcwidCartButtonBorderRadius",
        "cssStyleElementEcwidCartButtonSize"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons div .form-control .form-control__button .form-control__button-text": {
      standart: [
        "cssStyleElementEcwidCartButtonTypography2FontFamily",
        "cssStyleElementEcwidCartButtonTypography2FontSize",
        "cssStyleElementEcwidCartButtonTypography2LineHeight",
        "cssStyleElementEcwidCartButtonTypography2FontWeight",
        "cssStyleElementEcwidCartButtonTypography2LetterSpacing"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__button. form-control .form-control__button .form-control__button-text": {
      standart: [
        "cssStyleElementEcwidCartButtonTypography2FontFamily",
        "cssStyleElementEcwidCartButtonTypography2FontSize",
        "cssStyleElementEcwidCartButtonTypography2LineHeight",
        "cssStyleElementEcwidCartButtonTypography2FontWeight",
        "cssStyleElementEcwidCartButtonTypography2LetterSpacing"
      ]
    },
    // Style Email Description
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart-email .ec-cart-email__text": {
      standart: [
        "cssStyleElementEcwidCartEmailColor",
        "cssStyleElementEcwidCartEmailTypography2FontFamily",
        "cssStyleElementEcwidCartEmailTypography2FontSize",
        "cssStyleElementEcwidCartEmailTypography2LineHeight",
        "cssStyleElementEcwidCartEmailTypography2FontWeight",
        "cssStyleElementEcwidCartEmailTypography2LetterSpacing",
        "cssStyleElementEcwidCartEmailAlign"
      ]
    },
    // Style Checkbox
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__agreement .ec-cart__agreement.ec-cart__marketing-agreement .form-control--checkbox .form-control__inline-label": {
      standart: [
        "cssStyleElementEcwidCartCheckboxColor",
        "cssStyleElementEcwidCartCheckboxTypography2FontFamily",
        "cssStyleElementEcwidCartCheckboxTypography2FontSize",
        "cssStyleElementEcwidCartCheckboxTypography2LineHeight",
        "cssStyleElementEcwidCartCheckboxTypography2FontWeight",
        "cssStyleElementEcwidCartCheckboxTypography2LetterSpacing"
      ]
    },
    // Style Next Text
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next.ec-cart-next .ec-cart-next__header.ec-header-h4": {
      standart: [
        "cssStyleElementEcwidCartNextColor",
        "cssStyleElementEcwidCartNextTypography2FontFamily",
        "cssStyleElementEcwidCartNextTypography2FontSize",
        "cssStyleElementEcwidCartNextTypography2LineHeight",
        "cssStyleElementEcwidCartNextTypography2FontWeight",
        "cssStyleElementEcwidCartNextTypography2LetterSpacing",
        "cssStyleElementEcwidCartNextAlign"
      ]
    },
    // Style Payment and Confirmation Text
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--payment .ec-cart-next__title": {
      standart: [
        "cssStyleElementEcwidCartPaymentColor",
        "cssStyleElementEcwidCartPaymentTypography2FontFamily",
        "cssStyleElementEcwidCartPaymentTypography2FontSize",
        "cssStyleElementEcwidCartPaymentTypography2LineHeight",
        "cssStyleElementEcwidCartPaymentTypography2FontWeight",
        "cssStyleElementEcwidCartPaymentTypography2LetterSpacing",
        "cssStyleElementEcwidCartPaymentAlign"
      ]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--order-confirmation .ec-cart-next__title": {
      standart: [
        "cssStyleElementEcwidCartPaymentColor",
        "cssStyleElementEcwidCartPaymentTypography2FontFamily",
        "cssStyleElementEcwidCartPaymentTypography2FontSize",
        "cssStyleElementEcwidCartPaymentTypography2LineHeight",
        "cssStyleElementEcwidCartPaymentTypography2FontWeight",
        "cssStyleElementEcwidCartPaymentTypography2LetterSpacing",
        "cssStyleElementEcwidCartPaymentAlign"
      ]
    },
    // Style input
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control.form-control--flexible.form-control--large input#ec-cart-email-input": {
      standart: [
        "cssStyleElementEcwidCartInputColor",
        "cssStyleElementEcwidCartInputTypography2FontFamily",
        "cssStyleElementEcwidCartInputTypography2FontSize",
        "cssStyleElementEcwidCartInputTypography2LineHeight",
        "cssStyleElementEcwidCartInputTypography2FontWeight",
        "cssStyleElementEcwidCartInputTypography2LetterSpacing",
        "cssStyleElementEcwidCartInputSize",
        "cssStyleElementEcwidCartInputBorderRadius",
        "cssStyleElementEcwidCartInputBgColor",
        "cssStyleElementEcwidCartInputBorderColor",
        "cssStyleElementEcwidCartInputBoxShadow"
      ]
    },
    // Style Product Name
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__title": {
      standart: [
        "cssStyleElementEcwidCartProductNameColor",
        "cssStyleElementEcwidCartProductNameTypography2FontFamily",
        "cssStyleElementEcwidCartProductNameTypography2FontSize",
        "cssStyleElementEcwidCartProductNameTypography2LineHeight",
        "cssStyleElementEcwidCartProductNameTypography2FontWeight",
        "cssStyleElementEcwidCartProductNameTypography2LetterSpacing",
        "cssStyleElementEcwidCartProductNameAlign"
      ]
    },
    // Style Product Size
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options": {
      standart: ["cssStyleElementEcwidCartProductSizeAlign"]
    },
    ".brz && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option": {
      standart: [
        "cssStyleElementEcwidCartProductSizeColor",
        "cssStyleElementEcwidCartProductSizeTypography2FontFamily",
        "cssStyleElementEcwidCartProductSizeTypography2FontSize",
        "cssStyleElementEcwidCartProductSizeTypography2LineHeight",
        "cssStyleElementEcwidCartProductSizeTypography2FontWeight",
        "cssStyleElementEcwidCartProductSizeTypography2LetterSpacing"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles }) as [string, string, string];
}
