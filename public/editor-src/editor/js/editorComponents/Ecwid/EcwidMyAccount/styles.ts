import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types/Value";

export function style(data: DynamicStylesProps<Value>): OutputStyle {
  const styles: Styles = {
    "#ecwid_html #ecwid_body && .ecwid": {
      standart: [
        "cssStyleElementEcwidMyAccountParentBgColor",
        "cssStyleElementEcwidMyAccountParentBgGradient"
      ]
    },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--my-account":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--my-account:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--track-order":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--track-order:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--shopping-cart":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--shopping-cart:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.ec-link.ec-link--muted":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.ec-link.ec-link--muted:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterIconSpacing"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon svg":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterIconSize"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon:hover svg":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterIconColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name.ec-header-h1":
      {
        standart: [
          "cssStyleElementEcwidMyAccountTitleTypography",
          "cssStyleElementEcwidMyAccountTitleAlign",
          "cssStyleElementEcwidMyAccountTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name.ec-header-h1:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountTitleColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name.ec-header-h4, #ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-confirmation .ec-header-h1":
      {
        standart: [
          "cssStyleElementEcwidMyAccountTitle2Typography",
          "cssStyleElementEcwidMyAccountTitle2Align",
          "cssStyleElementEcwidMyAccountTitle2Spacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name.ec-header-h4:hover, #ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-confirmation .ec-header-h1":
      {
        standart: ["cssStyleElementEcwidMyAccountTitle2Color"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__text":
      {
        standart: [
          "cssStyleElementEcwidMyAccountDescriptionTypography",
          "cssStyleElementEcwidMyAccountDescriptionAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__text:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountDescriptionColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-confirmation .ec-confirmation__title:hover > *":
      {
        standart: [
          "cssStyleElementEcwidMyAccountDescriptionTypography",
          "cssStyleElementEcwidMyAccountDescriptionColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-confirmation .ec-confirmation__body .ec-text-muted:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountDescriptionColor",
          "cssStyleElementEcwidMyAccountDescriptionAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-confirmation .ec-cart__products .ec-cart__item .ec-cart-item__sum > *":
      {
        standart: [
          "cssStyleElementEcwidMyAccountDescriptionTypography",
          "cssStyleElementEcwidMyAccountDescriptionColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input":
      {
        standart: ["cssStyleElementEcwidMyAccountInputSpacing"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountInputBoxShadow"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control .form-control__text":
      {
        standart: [
          "cssStyleElementEcwidMyAccountInputHeight",
          "cssStyleElementEcwidMyAccountInputWidth",
          "cssStyleElementEcwidMyAccountInputBorderRadius",
          "cssStyleElementEcwidMyAccountInputTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control:hover .form-control__text":
      {
        standart: [
          "cssStyleElementEcwidMyAccountInputBgColor",
          "cssStyleElementEcwidMyAccountInputBgGradient",
          "cssStyleElementEcwidMyAccountInputBorderColor",
          "cssStyleElementEcwidMyAccountInputColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control:hover .form-control__text:-webkit-autofill":
      {
        standart: ["cssStyleElementEcwidCartInputColorAutofill"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control .form-control__placeholder .form-control__placeholder-inner":
      {
        standart: [
          "cssStyleElementEcwidMyAccountInputPlaceholderDisplay",
          "cssStyleElementEcwidMyAccountInputTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control:hover .form-control__placeholder .form-control__placeholder-inner":
      {
        standart: ["cssStyleElementEcwidMyAccountInputColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart__checkout .ec-cart__agreement":
      {
        standart: [
          "cssStyleElementEcwidMyAccountAgreementTypography",
          "cssStyleElementEcwidMyAccountAgreementColor",
          "cssStyleElementEcwidMyAccountAgreementAlign",
          "cssStyleElementEcwidMyAccountAgreementSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart__checkout .ec-cart__buttons .form-control":
      { standart: ["cssStyleElementEcwidMyAccountButtonAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart__checkout .ec-cart__buttons .form-control .form-control__button":
      {
        standart: [
          "cssStyleElementEcwidMyAccountButtonSize",
          "cssStyleElementEcwidMyAccountButtonWidth",
          "cssStyleElementEcwidMyAccountButtonBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart__checkout .ec-cart__buttons .form-control .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountButtonColor",
          "cssStyleElementEcwidMyAccountButtonBgColor",
          "cssStyleElementEcwidMyAccountButtonBgGradient",
          "cssStyleElementEcwidMyAccountButtonBorder",
          "cssStyleElementEcwidMyAccountButtonBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart__checkout .ec-cart__buttons .form-control .form-control__button .form-control__button-text":
      { standart: ["cssStyleElementEcwidMyAccountButtonTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__title.ec-header-h6 ":
      {
        standart: ["cssStyleElementEcwidMyAccountAccountTitleSpacing"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__title.ec-header-h6":
      {
        standart: [
          "cssStyleElementEcwidMyAccountAccountTitleTypography",
          "cssStyleElementEcwidMyAccountAccountTitleColor",
          "cssStyleElementEcwidMyAccountAccountTitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-confirmation .ec-confirmation__title.ec-header-h4:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountAccountTitleTypography",
          "cssStyleElementEcwidMyAccountAccountTitleColor",
          "cssStyleElementEcwidMyAccountAccountTitleAlign",
          "cssStyleElementEcwidMyAccountAccountTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section":
      {
        standart: ["cssStyleElementEcwidMyAccountConnectLinkAlign"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__text":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectTypography",
          "cssStyleElementEcwidMyAccountConnectColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-confirmation .ec-confirmation__body .ec-confirmation__section div:not(.ec-confirmation__action-link--desktop):not(.ec-confirmation__status):hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectTypography",
          "cssStyleElementEcwidMyAccountConnectColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart-step--signout .ec-cart-step__section .ec-cart-step__text:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectTypography",
          "cssStyleElementEcwidMyAccountConnectColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__change.ec-link":
      {
        standart: ["cssStyleElementEcwidMyAccountConnectLinkTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__change.ec-link:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountConnectLinkColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-confirmation .ec-confirmation__body .ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectLinkColor",
          "cssStyleElementEcwidMyAccountConnectLinkTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart-step__body .ec-cart-step__change.ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectLinkColor",
          "cssStyleElementEcwidMyAccountConnectLinkTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart__products .ec-cart-item .ec-cart-item__sum .ec-cart-item-sum.ec-cart-item-sum--items":
      {
        standart: [
          "cssStyleElementEcwidMyAccountProductsTypography",
          "cssStyleElementEcwidMyAccountProductsColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart__products":
      { standart: ["cssStyleElementEcwidMyAccountSummaryLinkAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart__products .ec-cart-item .ec-cart-item__sum .ec-cart-item-sum.ec-cart-item-sum--cta .ec-link":
      {
        standart: ["cssStyleElementEcwidMyAccountSummaryLinkTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart__products .ec-cart-item .ec-cart-item__sum .ec-cart-item-sum.ec-cart-item-sum--cta .ec-link:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountSummaryLinkColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart__step .ec-cart-step__block .ec-cart-step__icon.ec-cart-step__icon--custom":
      {
        standart: [
          "cssStyleElementEcwidMyAccountUserSize",
          "cssStyleElementEcwidMyAccountUserColor",
          "cssStyleElementEcwidMyAccountUserBgColor",
          "cssStyleElementEcwidMyAccountUserBgGradient",
          "cssStyleElementEcwidMyAccountUserBorder",
          "cssStyleElementEcwidMyAccountUserBoxShadow",
          "cssStyleElementEcwidMyAccountUserBorderRadius",
          "cssStyleElementEcwidMyAccountUserSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart__step .ec-cart-step__block .ec-cart-step__icon.ec-cart-step__icon--custom svg":
      { standart: ["cssStyleElementEcwidMyAccountUserSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart-step .ec-cart-step__wrap .ec-cart-step__title.ec-header-h4":
      {
        standart: [
          "cssStyleElementEcwidMyAccountShopTitleTypography",
          "cssStyleElementEcwidMyAccountShopTitleSpacing",
          "cssStyleElementEcwidMyAccountShopTitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart-step .ec-cart-step__wrap .ec-cart-step__title.ec-header-h4:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountShopTitleColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section":
      { standart: ["cssStyleElementEcwidMyAccountEmptyAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__text.ec-text-muted":
      {
        standart: ["cssStyleElementEcwidMyAccountEmptyTypography"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__text.ec-text-muted:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountEmptyColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture":
      {
        standart: [
          "cssStyleElementEcwidCartImageWidth",
          "cssStyleElementEcwidCartImageBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart-step--legallinks .ec-cart-step__section .ec-link":
      {
        standart: [
          "cssStyleElementEcwidMyAccountTermsTypography",
          "cssStyleElementEcwidMyAccountTermsAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart-step--legallinks .ec-cart-step__section .ec-link:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountTermsColor"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__checkout .ec-cart__agreement .ec-link":
      {
        standart: [
          "cssStyleElementEcwidMyAccountTermsTypography",
          "cssStyleElementEcwidMyAccountTermsAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__checkout .ec-cart__agreement .ec-link:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountTermsColor"]
      }
  };
  return renderStyles({ ...data, styles });
}
