import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types/Value";
import { DynamicStylesProps } from "visual/types";



export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser": {
      standart: [
        "cssStyleElementEcwidCartParentBgColor",
        "cssStyleElementEcwidCartParentBgGradient"
      ]
    },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper":
      { standart: ["cssStyleElementEcwidCartWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--my-account:hover":
      {
        standart: [
          "cssStyleElementEcwidCartFooterColor",
          "cssStyleElementEcwidCartFooterTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--track-order:hover":
      {
        standart: [
          "cssStyleElementEcwidCartFooterColor",
          "cssStyleElementEcwidCartFooterTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--shopping-cart:hover":
      {
        standart: [
          "cssStyleElementEcwidCartFooterColor",
          "cssStyleElementEcwidCartFooterTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.ec-link.ec-link--muted:hover":
      {
        standart: [
          "cssStyleElementEcwidCartFooterColor",
          "cssStyleElementEcwidCartFooterTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon":
      { standart: ["cssStyleElementEcwidCartFooterIconSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon:hover svg":
      {
        standart: [
          "cssStyleElementEcwidCartFooterIconSize",
          "cssStyleElementEcwidCartFooterIconColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name.ec-header-h1:hover":
      {
        standart: [
          "cssStyleElementEcwidCartTitleColor",
          "cssStyleElementEcwidCartTitleTypography",
          "cssStyleElementEcwidCartTitleAlign",
          "cssStyleElementEcwidCartTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-page-title .page-title__name.ec-header-h1:hover":
      {
        standart: [
          "cssStyleElementEcwidCartTitleColor",
          "cssStyleElementEcwidCartTitleTypography",
          "cssStyleElementEcwidCartTitleAlign",
          "cssStyleElementEcwidCartTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name":
      {
        standart: [
          "cssStyleElementEcwidCartTitle2Color",
          "cssStyleElementEcwidCartTitle2Typography",
          "cssStyleElementEcwidCartTitle2Align"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name":
      {
        standart: [
          "cssStyleElementEcwidCartTitle2Color",
          "cssStyleElementEcwidCartTitle2Typography",
          "cssStyleElementEcwidCartTitle2Align"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-page-title .page-title__name.ec-header-h1":
      {
        standart: [
          "cssStyleElementEcwidCartTitle2Color",
          "cssStyleElementEcwidCartTitle2Typography",
          "cssStyleElementEcwidCartTitle2Align"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__cert":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--cartitems .ec-confirmation__wrap .ec-confirmation__title.ec-header-h5":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--contactinfo .ec-confirmation__wrap .ec-confirmation__title.ec-header-h5":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--payment .ec-cart-next__text":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--orderinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--order-confirmation .ec-cart-next__text":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons":
      { standart: ["cssStyleElementEcwidCartButtonSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons div .form-control":
      { standart: ["cssStyleElementEcwidCartButtonAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons div .form-control .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSize",
          "cssStyleElementEcwidCartButtonWidth",
          "cssStyleElementEcwidCartButtonColor",
          "cssStyleElementEcwidCartButtonBgColor",
          "cssStyleElementEcwidCartButtonBgGradient",
          "cssStyleElementEcwidCartButtonBorder",
          "cssStyleElementEcwidCartButtonBoxShadow",
          "cssStyleElementEcwidCartButtonBorderRadius"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons div .form-control .form-control__button .form-control__button-text":
      { standart: ["cssStyleElementEcwidCartButtonTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__button":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSpacing",
          "cssStyleElementEcwidCartButtonAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__button .form-control":
      { standart: ["cssStyleElementEcwidCartButtonWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__button .form-control .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSize",
          "cssStyleElementEcwidCartButtonColor",
          "cssStyleElementEcwidCartButtonBgColor",
          "cssStyleElementEcwidCartButtonBgGradient",
          "cssStyleElementEcwidCartButtonBorder",
          "cssStyleElementEcwidCartButtonBoxShadow",
          "cssStyleElementEcwidCartButtonBorderRadius"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__button .form-control .form-control__button .form-control__button-text":
      { standart: ["cssStyleElementEcwidCartButtonTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart-step__body .ec-form .ec-form__row .ec-form__cell":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSpacing",
          "cssStyleElementEcwidCartButtonAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart-step__body .ec-form .ec-form__row .ec-form__cell .form-control":
      { standart: ["cssStyleElementEcwidCartButtonWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart-step__body .ec-form .ec-form__row .ec-form__cell .form-control .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSize",
          "cssStyleElementEcwidCartButtonColor",
          "cssStyleElementEcwidCartButtonBgColor",
          "cssStyleElementEcwidCartButtonBgGradient",
          "cssStyleElementEcwidCartButtonBorder",
          "cssStyleElementEcwidCartButtonBoxShadow",
          "cssStyleElementEcwidCartButtonBorderRadius"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart-step__body .ec-form .ec-form__row .ec-form__cell .form-control .form-control__button .form-control__button-text":
      { standart: ["cssStyleElementEcwidCartButtonTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__continue":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSpacing",
          "cssStyleElementEcwidCartButtonAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__continue .form-control":
      { standart: ["cssStyleElementEcwidCartButtonWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__continue .form-control .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSize",
          "cssStyleElementEcwidCartButtonColor",
          "cssStyleElementEcwidCartButtonBgColor",
          "cssStyleElementEcwidCartButtonBgGradient",
          "cssStyleElementEcwidCartButtonBorder",
          "cssStyleElementEcwidCartButtonBoxShadow",
          "cssStyleElementEcwidCartButtonBorderRadius"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__continue .form-control .form-control__button .form-control__button-text":
      { standart: ["cssStyleElementEcwidCartButtonTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart-email .ec-cart-email__text":
      {
        standart: [
          "cssStyleElementEcwidCartEmailColor",
          "cssStyleElementEcwidCartEmailTypography",
          "cssStyleElementEcwidCartEmailAlign",
          "cssStyleElementEcwidCartEmailSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__email":
      {
        standart: [
          "cssStyleElementEcwidCartEmailColor",
          "cssStyleElementEcwidCartEmailTypography",
          "cssStyleElementEcwidCartEmailAlign",
          "cssStyleElementEcwidCartEmailSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__agreement":
      { standart: ["cssStyleElementEcwidCartCheckboxSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__agreement .ec-cart__agreement.ec-cart__marketing-agreement .form-control--checkbox .form-control__inline-label":
      {
        standart: [
          "cssStyleElementEcwidCartCheckboxColor",
          "cssStyleElementEcwidCartCheckboxTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next.ec-cart-next .ec-cart-next__header.ec-header-h4":
      {
        standart: [
          "cssStyleElementEcwidCartNextColor",
          "cssStyleElementEcwidCartNextTypography",
          "cssStyleElementEcwidCartNextAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next.ec-cart-next .ec-cart-next__header.ec-header-h4":
      {
        standart: [
          "cssStyleElementEcwidCartNextColor",
          "cssStyleElementEcwidCartNextTypography",
          "cssStyleElementEcwidCartNextAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--unpaidstatusinfo .ec-confirmation__wrap .ec-confirmation__title.ec-header-h5":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentColor",
          "cssStyleElementEcwidCartPaymentTypography",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--orderinfo .ec-confirmation__wrap .ec-confirmation__title .ec-confirmation__number.ec-header-h5":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentColor",
          "cssStyleElementEcwidCartPaymentTypography",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--payment .ec-cart-next__title":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentColor",
          "cssStyleElementEcwidCartPaymentTypography",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--order-confirmation .ec-cart-next__title":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentColor",
          "cssStyleElementEcwidCartPaymentTypography",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__wrap .ec-cart-step__title":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentColor",
          "cssStyleElementEcwidCartPaymentTypography",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input":
      { standart: ["cssStyleElementEcwidCartInputSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control":
      { standart: ["cssStyleElementEcwidCartInputAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control:hover .form-control__text:-webkit-autofill":
      {
        standart: ["cssStyleElementEcwidCartInputColorAutofill"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control .form-control__text:hover":
      {
        standart: [
          "cssStyleElementEcwidCartInputHeight",
          "cssStyleElementEcwidCartInputWidth",
          "cssStyleElementEcwidCartInputTypography",
          "cssStyleElementEcwidCartInputBorderRadius",
          "cssStyleElementEcwidCartInputColor",
          "cssStyleElementEcwidCartInputBgColor",
          "cssStyleElementEcwidCartInputBgGradient",
          "cssStyleElementEcwidCartInputBorderColor",
          "cssStyleElementEcwidCartInputBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control .form-control__placeholder .form-control__placeholder-inner:hover":
      {
        standart: [
          "cssStyleElementEcwidCartInputWidth",
          "cssStyleElementEcwidCartInputTypography",
          "cssStyleElementEcwidCartInputColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__title":
      {
        standart: [
          "cssStyleElementEcwidCartProductNameColor",
          "cssStyleElementEcwidCartProductNameTypography",
          "cssStyleElementEcwidCartProductNameAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__title":
      {
        standart: [
          "cssStyleElementEcwidCartProductNameColor",
          "cssStyleElementEcwidCartProductNameTypography",
          "cssStyleElementEcwidCartProductNameAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--cartitems .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__title":
      {
        standart: [
          "cssStyleElementEcwidCartProductNameColor",
          "cssStyleElementEcwidCartProductNameTypography",
          "cssStyleElementEcwidCartProductNameAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options":
      { standart: ["cssStyleElementEcwidCartProductSizeAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option":
      {
        standart: [
          "cssStyleElementEcwidCartProductSizeColor",
          "cssStyleElementEcwidCartProductSizeTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options":
      { standart: ["cssStyleElementEcwidCartProductSizeAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option":
      {
        standart: [
          "cssStyleElementEcwidCartProductSizeColor",
          "cssStyleElementEcwidCartProductSizeTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options":
      { standart: ["cssStyleElementEcwidCartProductSizeAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option":
      {
        standart: [
          "cssStyleElementEcwidCartProductSizeColor",
          "cssStyleElementEcwidCartProductSizeTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__message:hover":
      {
        standart: [
          "cssStyleElementEcwidCartEmptyColor",
          "cssStyleElementEcwidCartEmptyTypography",
          "cssStyleElementEcwidCartEmptyAlign",
          "cssStyleElementEcwidCartEmptySpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products:not(.ec-cart__products--short-desktop) .ec-cart__products-inner .ec-cart-item .ec-cart-item__image":
      { standart: ["cssStyleElementEcwidCartImageSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products:not(.ec-cart__products--short-desktop) .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture:hover":
      {
        standart: [
          "cssStyleElementEcwidCartImageWidth",
          "cssStyleElementEcwidCartImageBorder",
          "cssStyleElementEcwidCartImageBorderRadius",
          "cssStyleElementEcwidCartImageBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--cartitems .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image":
      { standart: ["cssStyleElementEcwidCartImageSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--cartitems .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture:hover":
      {
        standart: [
          "cssStyleElementEcwidCartImageWidth",
          "cssStyleElementEcwidCartImageBorder",
          "cssStyleElementEcwidCartImageBorderRadius",
          "cssStyleElementEcwidCartImageBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__price .ec-cart-item__price-inner":
      {
        standart: [
          "cssStyleElementEcwidProductPriceColor",
          "cssStyleElementEcwidProductPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__item.ec-cart-item.ec-cart-item--summary .ec-cart-item__sum .ec-cart-item-sum.ec-cart-item-sum--cta":
      {
        standart: [
          "cssStyleElementEcwidProductPriceColor",
          "cssStyleElementEcwidProductPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__price .ec-cart-item__price-inner":
      {
        standart: [
          "cssStyleElementEcwidProductPriceColor",
          "cssStyleElementEcwidProductPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__title":
      {
        standart: [
          "cssStyleElementEcwidCartSummaryTitleColor",
          "cssStyleElementEcwidCartSummaryTitleTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--unpaidstatusinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section":
      {
        standart: [
          "cssStyleElementEcwidCartSummaryTitleColor",
          "cssStyleElementEcwidCartSummaryTitleTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__price .ec-cart-summary__total":
      {
        standart: [
          "cssStyleElementEcwidCartSummaryPriceColor",
          "cssStyleElementEcwidCartSummaryPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__price .ec-cart-summary__total":
      {
        standart: [
          "cssStyleElementEcwidCartSummaryPriceColor",
          "cssStyleElementEcwidCartSummaryPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--items .ec-cart-summary__cell.ec-cart-summary__title":
      {
        standart: [
          "cssStyleElementEcwidCartSubtotalTitleColor",
          "cssStyleElementEcwidCartSubtotalTitleTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--items .ec-cart-summary__cell.ec-cart-summary__price span":
      {
        standart: [
          "cssStyleElementEcwidCartSubtotalPriceColor",
          "cssStyleElementEcwidCartSubtotalPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--taxes .ec-cart-summary__cell.ec-cart-summary__title":
      {
        standart: [
          "cssStyleElementEcwidCartTaxesTitleColor",
          "cssStyleElementEcwidCartTaxesTitleTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--taxes .ec-cart-summary__cell.ec-cart-summary__price span":
      {
        standart: [
          "cssStyleElementEcwidCartTaxesPriceColor",
          "cssStyleElementEcwidCartTaxesPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row .ec-cart-summary__cell.ec-cart-summary__note":
      {
        standart: [
          "cssStyleElementEcwidCartSummaryNoteColor",
          "cssStyleElementEcwidCartSummaryNoteTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--unpaidstatusinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-confirmation__order-confirmation-total":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__shopping.ec-cart-shopping":
      { standart: ["cssStyleElementEcwidMyAccountConnectLinkAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__shopping.ec-cart-shopping .ec-cart-shopping__wrap":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectTypography",
          "cssStyleElementEcwidMyAccountConnectColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__shopping.ec-cart-shopping .ec-cart-shopping__wrap .ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectLinkTypography",
          "cssStyleElementEcwidMyAccountConnectLinkColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section":
      { standart: ["cssStyleElementEcwidMyAccountConnectLinkAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__text":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectTypography",
          "cssStyleElementEcwidMyAccountConnectColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__change:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectLinkTypography",
          "cssStyleElementEcwidMyAccountConnectLinkColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--contactinfo .ec-confirmation__wrap .ec-confirmation__body":
      { standart: ["cssStyleElementEcwidMyAccountConnectLinkAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--contactinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectTypography",
          "cssStyleElementEcwidMyAccountConnectColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--contactinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectLinkTypography",
          "cssStyleElementEcwidMyAccountConnectLinkColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count--select .ec-cart-item__count-inner .ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidProductQtyColor",
          "cssStyleElementEcwidCartQtyTypography"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count .ec-cart-item__count-inner:hover":
      {
        standart: [
          "cssStyleElementEcwidProductQtyColor",
          "cssStyleElementEcwidCartQtyTypography"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count .ec-cart-item__count-inner .form-control .form-control__text:hover":
      {
        standart: [
          "cssStyleElementEcwidProductQtyColor",
          "cssStyleElementEcwidCartQtyTypography"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__control":
      { standart: ["cssStyleElementEcwidCartCloseSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__control .ec-cart-item__control-inner:hover":
      {
        standart: [
          "cssStyleElementEcwidCartClosePadding",
          "cssStyleElementEcwidCartCloseIconColor",
          "cssStyleElementEcwidCartCloseBgColor",
          "cssStyleElementEcwidCartCloseBorderColor",
          "cssStyleElementEcwidCartCloseBorderRadiusColor",
          "cssStyleElementEcwidCartCloseBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__control .ec-cart-item__control-inner svg":
      { standart: ["cssStyleElementEcwidCartCloseSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__sku.ec-text-muted":
      {
        standart: [
          "cssStyleElementEcwidProductSKUAlign",
          "cssStyleElementEcwidProductSKUSpacing",
          "cssStyleElementEcwidProductSKUColor",
          "cssStyleElementEcwidProductSKUTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-related-products .ec-related-products__products.ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap":
      { standart: ["cssStyleElementEcwidProductGridSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-related-products .ec-related-products__products.ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap:hover .grid-product__wrap-inner":
      {
        standart: [
          "cssStyleElementEcwidProductGridBgColor",
          "cssStyleElementEcwidProductGridBgGradient",
          "cssStyleElementEcwidProductGridBorder",
          "cssStyleElementEcwidProductGridBorderRadius",
          "cssStyleElementEcwidProductGridBoxShadow"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-related-products .ec-related-products__products.ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__title .grid-product__title-inner":
      {
        standart: [
          "cssStyleElementEcwidProductGridTitleColor",
          "cssStyleElementEcwidProductGridTitleTypography",
          "cssStyleElementEcwidProductGridTitleAlign",
          "cssStyleElementEcwidProductGridTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-related-products .ec-related-products__products.ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__subtitle .grid-product__subtitle-inner":
      {
        standart: [
          "cssStyleElementEcwidProductGridSubtitleColor",
          "cssStyleElementEcwidProductGridSubtitleTypography",
          "cssStyleElementEcwidProductGridSubtitleAlign",
          "cssStyleElementEcwidProductGridSubtitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-related-products .ec-related-products__products.ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__sku-inner":
      {
        standart: [
          "cssStyleElementEcwidProductGridSKUInnerColor",
          "cssStyleElementEcwidProductGridSKUInnerTypography",
          "cssStyleElementEcwidProductGridSKUInnerAlign",
          "cssStyleElementEcwidProductGridSKUInnerSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-related-products .ec-related-products__products.ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__price":
      { standart: ["cssStyleElementEcwidProductGridPriceAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-related-products .ec-related-products__products.ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__price .grid-product__price-amount .grid-product__price-value":
      {
        standart: [
          "cssStyleElementEcwidProductGridPriceSpacing",
          "cssStyleElementEcwidProductGridPriceColor",
          "cssStyleElementEcwidProductGridPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart-item--summary .ec-cart-item__sum .ec-cart-item-sum .form-control":
      { standart: ["cssStyleElementEcwidCartTotalProductsCountTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart-item--summary .ec-cart-item__sum .ec-cart-item-sum .form-control:hover .form-control__select-text":
      {
        standart: ["cssStyleElementEcwidCartTotalProductsCountColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart-item--summary .ec-cart-item__sum .ec-cart-item-sum .form-control:hover .form-control__arrow":
      {
        standart: ["cssStyleElementEcwidCartTotalProductsCountColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products--short-desktop .ec-cart__products-inner .ec-cart-item .ec-cart-item__image":
      { standart: ["cssStyleElementEcwidCartCollapsedImageSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products--short-desktop .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture:hover":
      {
        standart: [
          "cssStyleElementEcwidCartCollapsedImageWidth",
          "cssStyleElementEcwidCartCollapsedImageBorder",
          "cssStyleElementEcwidCartCollapsedImageBorderRadius",
          "cssStyleElementEcwidCartCollapsedImageBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
