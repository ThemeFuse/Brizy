import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { Value } from "./types/Value";

export function style(v: Value, vs: Value, vd: Value): OutputStyle {
  const styles: Styles = {
    "#ecwid_html #ecwid_body && .ecwid": {
      standart: [
        "cssStyleElementEcwidMyAccountParentBgColor",
        "cssStyleElementEcwidMyAccountParentBgGradient"
      ]
    },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--my-account:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountFooterTypography",
          "cssStyleElementEcwidMyAccountFooterColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--track-order:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountFooterTypography",
          "cssStyleElementEcwidMyAccountFooterColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--shopping-cart:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountFooterTypography",
          "cssStyleElementEcwidMyAccountFooterColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.ec-link.ec-link--muted:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountFooterTypography",
          "cssStyleElementEcwidMyAccountFooterColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon":
      {
        standart: ["cssStyleElementEcwidMyAccountFooterIconSpacing"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon:hover svg":
      {
        standart: [
          "cssStyleElementEcwidMyAccountFooterIconSize",
          "cssStyleElementEcwidMyAccountFooterIconColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name.ec-header-h1:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountTitleTypography",
          "cssStyleElementEcwidMyAccountTitleColor",
          "cssStyleElementEcwidMyAccountTitleAlign",
          "cssStyleElementEcwidMyAccountTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name.ec-header-h4:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountTitle2Typography",
          "cssStyleElementEcwidMyAccountTitle2Color",
          "cssStyleElementEcwidMyAccountTitle2Align",
          "cssStyleElementEcwidMyAccountTitle2Spacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__text:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountDescriptionTypography",
          "cssStyleElementEcwidMyAccountDescriptionColor",
          "cssStyleElementEcwidMyAccountDescriptionAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input":
      {
        standart: ["cssStyleElementEcwidMyAccountInputSpacing"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control:hover":
      {
        standart: ["cssStyleElementEcwidMyAccountInputBoxShadow"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control:hover .form-control__text":
      {
        standart: [
          "cssStyleElementEcwidMyAccountInputHeight",
          "cssStyleElementEcwidMyAccountInputWidth",
          "cssStyleElementEcwidMyAccountInputBgColor",
          "cssStyleElementEcwidMyAccountInputBgGradient",
          "cssStyleElementEcwidMyAccountInputBorderColor",
          "cssStyleElementEcwidMyAccountInputBorderRadius",
          "cssStyleElementEcwidMyAccountInputTypography",
          "cssStyleElementEcwidMyAccountInputColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control:hover .form-control__text:-webkit-autofill":
      {
        standart: ["cssStyleElementEcwidCartInputColorAutofill"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart-email .ec-cart-email__input .form-control:hover .form-control__placeholder .form-control__placeholder-inner":
      {
        standart: [
          "cssStyleElementEcwidMyAccountInputPlaceholderDisplay",
          "cssStyleElementEcwidMyAccountInputTypography",
          "cssStyleElementEcwidMyAccountInputColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart__checkout .ec-cart__agreement":
      {
        standart: [
          "cssStyleElementEcwidMyAccountAgreementTypography",
          "cssStyleElementEcwidMyAccountAgreementColor",
          "cssStyleElementEcwidMyAccountAgreementAlign",
          "cssStyleElementEcwidMyAccountAgreementSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart__checkout .ec-cart__buttons .form-control":
      { standart: ["cssStyleElementEcwidMyAccountButtonAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart__checkout .ec-cart__buttons .form-control .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountButtonSize",
          "cssStyleElementEcwidMyAccountButtonWidth",
          "cssStyleElementEcwidMyAccountButtonColor",
          "cssStyleElementEcwidMyAccountButtonBgColor",
          "cssStyleElementEcwidMyAccountButtonBgGradient",
          "cssStyleElementEcwidMyAccountButtonBorder",
          "cssStyleElementEcwidMyAccountButtonBoxShadow",
          "cssStyleElementEcwidMyAccountButtonBorderRadius"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-signin-form .ec-cart__checkout .ec-cart__buttons .form-control .form-control__button .form-control__button-text":
      { standart: ["cssStyleElementEcwidMyAccountButtonTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__title.ec-header-h6 ":
      {
        standart: ["cssStyleElementEcwidMyAccountAccountTitleSpacing"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__title.ec-header-h6":
      {
        standart: [
          "cssStyleElementEcwidMyAccountAccountTitleTypography",
          "cssStyleElementEcwidMyAccountAccountTitleColor",
          "cssStyleElementEcwidMyAccountAccountTitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section":
      {
        standart: ["cssStyleElementEcwidMyAccountConnectLinkAlign"]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__text":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectTypography",
          "cssStyleElementEcwidMyAccountConnectColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__change.ec-link:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart__products .ec-cart-item .ec-cart-item__sum .ec-cart-item-sum.ec-cart-item-sum--items":
      {
        standart: [
          "cssStyleElementEcwidMyAccountProductsTypography",
          "cssStyleElementEcwidMyAccountProductsColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart__products":
      { standart: ["cssStyleElementEcwidMyAccountSummaryLinkAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart__products .ec-cart-item .ec-cart-item__sum .ec-cart-item-sum.ec-cart-item-sum--cta .ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountSummaryLinkTypography",
          "cssStyleElementEcwidMyAccountSummaryLinkColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart__step .ec-cart-step__block .ec-cart-step__icon.ec-cart-step__icon--custom":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__account-info .ec-cart__step .ec-cart-step__block .ec-cart-step__icon.ec-cart-step__icon--custom svg":
      { standart: ["cssStyleElementEcwidMyAccountUserSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart-step .ec-cart-step__wrap .ec-cart-step__title.ec-header-h4:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountShopTitleTypography",
          "cssStyleElementEcwidMyAccountShopTitleSpacing",
          "cssStyleElementEcwidMyAccountShopTitleColor",
          "cssStyleElementEcwidMyAccountShopTitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section":
      { standart: ["cssStyleElementEcwidMyAccountEmptyAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__text.ec-text-muted:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountEmptyTypography",
          "cssStyleElementEcwidMyAccountEmptyColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__step .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .ec-breadcrumbs":
      {
        standart: [
          "cssStyleElementEcwidMyAccountBreadcrumbsAlign",
          "cssStyleElementEcwidProductBreadcrumbsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .ec-breadcrumbs .breadcrumbs__link:hover":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsColor",
          "cssStyleElementEcwidProductBreadcrumbsTypography"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .ec-breadcrumbs .breadcrumbs__delimiter.ec-text-muted:hover":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsColor",
          "cssStyleElementEcwidProductBreadcrumbsTypography"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart-step--legallinks .ec-cart-step__section .ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountTermsColor",
          "cssStyleElementEcwidMyAccountTermsTypography",
          "cssStyleElementEcwidMyAccountTermsAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__checkout .ec-cart__agreement .ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountTermsColor",
          "cssStyleElementEcwidMyAccountTermsTypography",
          "cssStyleElementEcwidMyAccountTermsAlign"
        ]
      }
  };
  return renderStyles({ v, vs, vd, styles });
}
