import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types/Value";

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
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--my-account":
      {
        standart: ["cssStyleElementEcwidCartFooterTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--my-account:hover":
      {
        standart: ["cssStyleElementEcwidCartFooterColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--track-order":
      {
        standart: ["cssStyleElementEcwidCartFooterTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--track-order:hover":
      {
        standart: ["cssStyleElementEcwidCartFooterColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--shopping-cart":
      {
        standart: ["cssStyleElementEcwidCartFooterTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--shopping-cart:hover":
      {
        standart: ["cssStyleElementEcwidCartFooterColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.ec-link.ec-link--muted":
      {
        standart: ["cssStyleElementEcwidCartFooterTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.ec-link.ec-link--muted:hover":
      {
        standart: ["cssStyleElementEcwidCartFooterColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon":
      { standart: ["cssStyleElementEcwidCartFooterIconSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon svg":
      {
        standart: ["cssStyleElementEcwidCartFooterIconSize"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon:hover svg":
      {
        standart: ["cssStyleElementEcwidCartFooterIconColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name.ec-header-h1":
      {
        standart: [
          "cssStyleElementEcwidCartTitleTypography",
          "cssStyleElementEcwidCartTitleAlign",
          "cssStyleElementEcwidCartTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name.ec-header-h1:hover":
      {
        standart: ["cssStyleElementEcwidCartTitleColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-page-title .page-title__name.ec-header-h1":
      {
        standart: [
          "cssStyleElementEcwidCartTitleTypography",
          "cssStyleElementEcwidCartTitleAlign",
          "cssStyleElementEcwidCartTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-page-title .page-title__name.ec-header-h1:hover":
      {
        standart: ["cssStyleElementEcwidCartTitleColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name":
      {
        standart: [
          "cssStyleElementEcwidCartTitle2Typography",
          "cssStyleElementEcwidCartTitle2Align"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name:hover":
      {
        standart: ["cssStyleElementEcwidCartTitle2Color"]
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
          "cssStyleElementEcwidCartTitle2Typography",
          "cssStyleElementEcwidCartTitle2Align"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-page-title .page-title__name.ec-header-h1:hover":
      {
        standart: ["cssStyleElementEcwidCartTitle2Color"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__cert":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__cert:hover":
      {
        standart: ["cssStyleElementEcwidCartSubtitleColor"]
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
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--payment .ec-cart-next__text:hover":
      {
        standart: ["cssStyleElementEcwidCartSubtitleColor"]
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
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--order-confirmation .ec-cart-next__text:hover":
      {
        standart: ["cssStyleElementEcwidCartSubtitleColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--shipping .ec-cart-next__text":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--shipping .ec-cart-next__text:hover":
      {
        standart: ["cssStyleElementEcwidCartSubtitleColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypography",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons div .form-control":
      { standart: ["cssStyleElementEcwidCartButtonAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons div .form-control.ec-cart__button--checkout .form-control__button":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSize",
          "cssStyleElementEcwidCartButtonWidth",
          "cssStyleElementEcwidCartButtonBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons div .form-control.ec-cart__button--checkout .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidCartButtonColor",
          "cssStyleElementEcwidCartButtonBgColor",
          "cssStyleElementEcwidCartButtonBgGradient",
          "cssStyleElementEcwidCartButtonBorder",
          "cssStyleElementEcwidCartButtonBoxShadow"
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
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__button .form-control .form-control__button":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSize",
          "cssStyleElementEcwidCartButtonBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__button .form-control .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidCartButtonColor",
          "cssStyleElementEcwidCartButtonBgColor",
          "cssStyleElementEcwidCartButtonBgGradient",
          "cssStyleElementEcwidCartButtonBorder",
          "cssStyleElementEcwidCartButtonBoxShadow"
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
        standart: ["cssStyleElementEcwidCartButtonAlignVertically"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart-step__body .ec-form .ec-form__row.ec-form__row--continue .ec-form__cell .form-control":
      { standart: ["cssStyleElementEcwidCartButtonWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart-step__body .ec-form .ec-form__row .ec-form__cell .form-control .form-control__button":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSize",
          "cssStyleElementEcwidCartButtonBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart-step__body .ec-form .ec-form__row .ec-form__cell .form-control .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidCartButtonColor",
          "cssStyleElementEcwidCartButtonBgColor",
          "cssStyleElementEcwidCartButtonBgGradient",
          "cssStyleElementEcwidCartButtonBorder",
          "cssStyleElementEcwidCartButtonBoxShadow"
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
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__continue .form-control .form-control__button":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSize",
          "cssStyleElementEcwidCartButtonBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__continue .form-control .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidCartButtonColor",
          "cssStyleElementEcwidCartButtonBgColor",
          "cssStyleElementEcwidCartButtonBgGradient",
          "cssStyleElementEcwidCartButtonBorder",
          "cssStyleElementEcwidCartButtonBoxShadow"
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
          "cssStyleElementEcwidCartEmailTypography",
          "cssStyleElementEcwidCartEmailAlign",
          "cssStyleElementEcwidCartEmailSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart-email .ec-cart-email__text:hover":
      {
        standart: ["cssStyleElementEcwidCartEmailColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__step .ec-cart-step__body .ec-cart-step__section p:not(.ec-cart-step__subtitle):not(.ec-cart-step__mandatory-fields-notice)":
      {
        standart: [
          "cssStyleElementEcwidCartEmailTypography",
          "cssStyleElementEcwidCartEmailAlign",
          "cssStyleElementEcwidCartEmailSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__step .ec-cart-step__body .ec-cart-step__section p:not(.ec-cart-step__subtitle):not(.ec-cart-step__mandatory-fields-notice):hover":
      {
        standart: ["cssStyleElementEcwidCartEmailColor"]
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
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__agreement .form-control--checkbox .form-control__inline-label":
      {
        standart: [
          "cssStyleElementEcwidCartCheckboxColor",
          "cssStyleElementEcwidCartCheckboxTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next.ec-cart-next .ec-cart-next__header.ec-header-h4":
      {
        standart: [
          "cssStyleElementEcwidCartNextTypography",
          "cssStyleElementEcwidCartNextAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next.ec-cart-next .ec-cart-next__header.ec-header-h4:hover":
      {
        standart: ["cssStyleElementEcwidCartNextColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart-step__next":
      {
        standart: [
          "cssStyleElementEcwidCartNextTypography",
          "cssStyleElementEcwidCartNextAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart-step__next:hover":
      {
        standart: ["cssStyleElementEcwidCartNextColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next.ec-cart-next .ec-cart-next__header.ec-header-h4":
      {
        standart: [
          "cssStyleElementEcwidCartNextTypography",
          "cssStyleElementEcwidCartNextAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next.ec-cart-next .ec-cart-next__header.ec-header-h4:hover":
      {
        standart: ["cssStyleElementEcwidCartNextColor"]
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
          "cssStyleElementEcwidCartPaymentTypography",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--payment .ec-cart-next__title:hover":
      {
        standart: ["cssStyleElementEcwidCartPaymentColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--order-confirmation .ec-cart-next__title":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentTypography",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--order-confirmation .ec-cart-next__title:hover":
      {
        standart: ["cssStyleElementEcwidCartPaymentColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--shipping .ec-cart-next__title":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentTypography",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--shipping .ec-cart-next__title:hover":
      {
        standart: ["cssStyleElementEcwidCartPaymentColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__wrap .ec-cart-step__title":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentTypography",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__wrap .ec-cart-step__title:hover":
      {
        standart: ["cssStyleElementEcwidCartPaymentColor"]
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
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control .form-control__text":
      {
        standart: [
          "cssStyleElementEcwidCartInputHeight",
          "cssStyleElementEcwidCartInputWidth",
          "cssStyleElementEcwidCartInputTypography",
          "cssStyleElementEcwidCartInputBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control .form-control__text:hover":
      {
        standart: [
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
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control .form-control__placeholder .form-control__placeholder-inner":
      {
        standart: [
          "cssStyleElementEcwidCartInputWidth",
          "cssStyleElementEcwidCartInputTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control .form-control__placeholder .form-control__placeholder-inner:hover":
      {
        standart: ["cssStyleElementEcwidCartInputColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__title":
      {
        standart: [
          "cssStyleElementEcwidCartProductNameTypography",
          "cssStyleElementEcwidCartProductNameAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary:hover .ec-cart-item__title":
      {
        standart: ["cssStyleElementEcwidCartProductNameColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__title":
      {
        standart: [
          "cssStyleElementEcwidCartProductNameTypography",
          "cssStyleElementEcwidCartProductNameAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__title:hover":
      {
        standart: ["cssStyleElementEcwidCartProductNameColor"]
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
        standart: ["cssStyleElementEcwidCartProductSizeTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option:hover":
      {
        standart: ["cssStyleElementEcwidCartProductSizeColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options":
      { standart: ["cssStyleElementEcwidCartProductSizeAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option":
      {
        standart: ["cssStyleElementEcwidCartProductSizeTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option:hover":
      {
        standart: ["cssStyleElementEcwidCartProductSizeColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options":
      { standart: ["cssStyleElementEcwidCartProductSizeAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option":
      {
        standart: ["cssStyleElementEcwidCartProductSizeTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option:hover":
      {
        standart: ["cssStyleElementEcwidCartProductSizeColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__message":
      {
        standart: [
          "cssStyleElementEcwidCartEmptyTypography",
          "cssStyleElementEcwidCartEmptyAlign",
          "cssStyleElementEcwidCartEmptySpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__message:hover":
      {
        standart: ["cssStyleElementEcwidCartEmptyColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products:not(.ec-cart__products--short-desktop) .ec-cart__products-inner .ec-cart-item .ec-cart-item__image":
      { standart: ["cssStyleElementEcwidCartImageSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products:not(.ec-cart__products--short-desktop) .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture":
      {
        standart: [
          "cssStyleElementEcwidCartImageWidth",
          "cssStyleElementEcwidCartImageBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products:not(.ec-cart__products--short-desktop) .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture:hover":
      {
        standart: [
          "cssStyleElementEcwidCartImageBorder",
          "cssStyleElementEcwidCartImageBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--cartitems .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image":
      { standart: ["cssStyleElementEcwidCartImageSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--cartitems .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture":
      {
        standart: [
          "cssStyleElementEcwidCartImageWidth",
          "cssStyleElementEcwidCartImageBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--cartitems .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture:hover":
      {
        standart: [
          "cssStyleElementEcwidCartImageBorder",
          "cssStyleElementEcwidCartImageBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__price .ec-cart-item__price-inner":
      {
        standart: ["cssStyleElementEcwidProductPriceTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__price .ec-cart-item__price-inner:hover":
      {
        standart: ["cssStyleElementEcwidProductPriceColor"]
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
        standart: ["cssStyleElementEcwidProductPriceTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__price .ec-cart-item__price-inner:hover":
      {
        standart: ["cssStyleElementEcwidProductPriceColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__title":
      {
        standart: ["cssStyleElementEcwidCartSummaryTitleTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__title:hover":
      {
        standart: ["cssStyleElementEcwidCartSummaryTitleColor"]
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
        standart: ["cssStyleElementEcwidCartSummaryPriceTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__price .ec-cart-summary__total:hover":
      {
        standart: ["cssStyleElementEcwidCartSummaryPriceColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__price .ec-cart-summary__total":
      {
        standart: ["cssStyleElementEcwidCartSummaryPriceTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__price .ec-cart-summary__total:hover":
      {
        standart: ["cssStyleElementEcwidCartSummaryPriceColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--items .ec-cart-summary__cell.ec-cart-summary__title":
      {
        standart: ["cssStyleElementEcwidCartSubtotalTitleTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--items .ec-cart-summary__cell.ec-cart-summary__title:hover":
      {
        standart: ["cssStyleElementEcwidCartSubtotalTitleColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--items .ec-cart-summary__cell.ec-cart-summary__price span":
      {
        standart: ["cssStyleElementEcwidCartSubtotalPriceTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--items .ec-cart-summary__cell.ec-cart-summary__price span:hover":
      {
        standart: ["cssStyleElementEcwidCartSubtotalPriceColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--taxes .ec-cart-summary__cell.ec-cart-summary__title":
      {
        standart: ["cssStyleElementEcwidCartTaxesTitleTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--taxes .ec-cart-summary__cell.ec-cart-summary__title:hover":
      {
        standart: ["cssStyleElementEcwidCartTaxesTitleColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--taxes .ec-cart-summary__cell.ec-cart-summary__price span":
      {
        standart: ["cssStyleElementEcwidCartTaxesPriceTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--taxes .ec-cart-summary__cell.ec-cart-summary__price span:hover":
      {
        standart: ["cssStyleElementEcwidCartTaxesPriceColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row .ec-cart-summary__cell.ec-cart-summary__note":
      {
        standart: ["cssStyleElementEcwidCartSummaryNoteTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row .ec-cart-summary__cell.ec-cart-summary__note:hover":
      {
        standart: ["cssStyleElementEcwidCartSummaryNoteColor"]
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
        standart: ["cssStyleElementEcwidMyAccountConnectTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__shopping.ec-cart-shopping .ec-cart-shopping__wrap:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountConnectColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__shopping.ec-cart-shopping .ec-cart-shopping__wrap .ec-link":
      {
        standart: ["cssStyleElementEcwidMyAccountConnectLinkTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__shopping.ec-cart-shopping .ec-cart-shopping__wrap .ec-link:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountConnectLinkColor"],
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
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__change":
      {
        standart: ["cssStyleElementEcwidMyAccountConnectLinkTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__change:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountConnectLinkColor"],
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
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--contactinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-link":
      {
        standart: ["cssStyleElementEcwidMyAccountConnectLinkTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--contactinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-link:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountConnectLinkColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count--select .ec-cart-item__count-inner":
      {
        standart: ["cssStyleElementEcwidCartQtyTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count--select .ec-cart-item__count-inner:hover":
      {
        standart: ["cssStyleElementEcwidProductQtyColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count .ec-cart-item__count-inner":
      {
        standart: ["cssStyleElementEcwidCartQtyTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count .ec-cart-item__count-inner:hover":
      {
        standart: ["cssStyleElementEcwidProductQtyColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count .ec-cart-item__count-inner .form-control .form-control__text":
      {
        standart: ["cssStyleElementEcwidCartQtyTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count .ec-cart-item__count-inner .form-control .form-control__text:hover":
      {
        standart: ["cssStyleElementEcwidProductQtyColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart__sidebar .ec-cart__products .ec-cart__item .ec-cart-item__count":
      {
        standart: ["cssStyleElementEcwidCartQtyTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart__sidebar .ec-cart__products .ec-cart__item .ec-cart-item__count:hover":
      {
        standart: ["cssStyleElementEcwidProductQtyColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__control":
      { standart: ["cssStyleElementEcwidCartCloseSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__control .ec-cart-item__control-inner":
      {
        standart: [
          "cssStyleElementEcwidCartClosePadding",
          "cssStyleElementEcwidCartCloseBorderRadiusColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__control .ec-cart-item__control-inner:hover":
      {
        standart: [
          "cssStyleElementEcwidCartCloseIconColor",
          "cssStyleElementEcwidCartCloseBgColor",
          "cssStyleElementEcwidCartCloseBorderColor",
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
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-related-products .ec-related-products__products.ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner":
      {
        standart: ["cssStyleElementEcwidProductGridBorderRadius"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-related-products .ec-related-products__products.ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap:hover .grid-product__wrap-inner":
      {
        standart: [
          "cssStyleElementEcwidProductGridBgColor",
          "cssStyleElementEcwidProductGridBgGradient",
          "cssStyleElementEcwidProductGridBorder",
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
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products--short-desktop .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture":
      {
        standart: [
          "cssStyleElementEcwidCartCollapsedImageWidth",
          "cssStyleElementEcwidCartCollapsedImageBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products--short-desktop .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture:hover":
      {
        standart: [
          "cssStyleElementEcwidCartCollapsedImageBorder",
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
