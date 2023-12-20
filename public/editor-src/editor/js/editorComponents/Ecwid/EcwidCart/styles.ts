import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types/Value";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser":
      {
        standart: [
          "cssStyleElementEcwidCartParentBgColor",
          "cssStyleElementEcwidCartParentBgGradient"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper":
      { standart: ["cssStyleElementEcwidCartWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--my-account":
      {
        standart: [
          "cssStyleElementEcwidCartFooterColor",
          "cssStyleElementEcwidCartFooterTypographyFontFamily",
          "cssStyleElementEcwidCartFooterTypographyFontSize",
          "cssStyleElementEcwidCartFooterTypographyLineHeight",
          "cssStyleElementEcwidCartFooterTypographyFontWeight",
          "cssStyleElementEcwidCartFooterTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--track-order":
      {
        standart: [
          "cssStyleElementEcwidCartFooterColor",
          "cssStyleElementEcwidCartFooterTypographyFontFamily",
          "cssStyleElementEcwidCartFooterTypographyFontSize",
          "cssStyleElementEcwidCartFooterTypographyLineHeight",
          "cssStyleElementEcwidCartFooterTypographyFontWeight",
          "cssStyleElementEcwidCartFooterTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--shopping-cart":
      {
        standart: [
          "cssStyleElementEcwidCartFooterColor",
          "cssStyleElementEcwidCartFooterTypographyFontFamily",
          "cssStyleElementEcwidCartFooterTypographyFontSize",
          "cssStyleElementEcwidCartFooterTypographyLineHeight",
          "cssStyleElementEcwidCartFooterTypographyFontWeight",
          "cssStyleElementEcwidCartFooterTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.ec-link.ec-link--muted":
      {
        standart: [
          "cssStyleElementEcwidCartFooterColor",
          "cssStyleElementEcwidCartFooterTypographyFontFamily",
          "cssStyleElementEcwidCartFooterTypographyFontSize",
          "cssStyleElementEcwidCartFooterTypographyLineHeight",
          "cssStyleElementEcwidCartFooterTypographyFontWeight",
          "cssStyleElementEcwidCartFooterTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon":
      { standart: ["cssStyleElementEcwidCartFooterIconSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon:hover svg":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name.ec-header-h1":
      {
        standart: [
          "cssStyleElementEcwidCartTitleColor",
          "cssStyleElementEcwidCartTitleTypographyFontFamily",
          "cssStyleElementEcwidCartTitleTypographyFontSize",
          "cssStyleElementEcwidCartTitleTypographyLineHeight",
          "cssStyleElementEcwidCartTitleTypographyFontWeight",
          "cssStyleElementEcwidCartTitleTypographyLetterSpacing",
          "cssStyleElementEcwidCartTitleAlign",
          "cssStyleElementEcwidCartTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-page-title .page-title__name.ec-header-h1":
      {
        standart: [
          "cssStyleElementEcwidCartTitleColor",
          "cssStyleElementEcwidCartTitleTypographyFontFamily",
          "cssStyleElementEcwidCartTitleTypographyFontSize",
          "cssStyleElementEcwidCartTitleTypographyLineHeight",
          "cssStyleElementEcwidCartTitleTypographyFontWeight",
          "cssStyleElementEcwidCartTitleTypographyLetterSpacing",
          "cssStyleElementEcwidCartTitleAlign",
          "cssStyleElementEcwidCartTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-page-title .ec-breadcrumbs":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsAlign",
          "cssStyleElementEcwidProductBreadcrumbsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-page-title .ec-breadcrumbs .breadcrumbs__link":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsColor",
          "cssStyleElementEcwidProductBreadcrumbsTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-page-title .breadcrumbs__delimiter":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsColor",
          "cssStyleElementEcwidProductBreadcrumbsTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .ec-breadcrumbs":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsAlign",
          "cssStyleElementEcwidProductBreadcrumbsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .ec-breadcrumbs .breadcrumbs__link":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsColor",
          "cssStyleElementEcwidProductBreadcrumbsTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .breadcrumbs__delimiter":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsColor",
          "cssStyleElementEcwidProductBreadcrumbsTypography"
        ]
      },

    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .ec-breadcrumbs":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsAlign",
          "cssStyleElementEcwidProductBreadcrumbsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .ec-breadcrumbs .breadcrumbs__link":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsColor",
          "cssStyleElementEcwidProductBreadcrumbsTypography"
        ]
      },

    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-page-title .page-title__name":
      {
        standart: [
          "cssStyleElementEcwidCartTitle2Color",
          "cssStyleElementEcwidCartTitle2TypographyFontFamily",
          "cssStyleElementEcwidCartTitle2TypographyFontSize",
          "cssStyleElementEcwidCartTitle2TypographyLineHeight",
          "cssStyleElementEcwidCartTitle2TypographyFontWeight",
          "cssStyleElementEcwidCartTitle2TypographyLetterSpacing",
          "cssStyleElementEcwidCartTitle2Align"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-page-title .page-title__name":
      {
        standart: [
          "cssStyleElementEcwidCartTitle2Color",
          "cssStyleElementEcwidCartTitle2TypographyFontFamily",
          "cssStyleElementEcwidCartTitle2TypographyFontSize",
          "cssStyleElementEcwidCartTitle2TypographyLineHeight",
          "cssStyleElementEcwidCartTitle2TypographyFontWeight",
          "cssStyleElementEcwidCartTitle2TypographyLetterSpacing",
          "cssStyleElementEcwidCartTitle2Align"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-page-title .page-title__name.ec-header-h1":
      {
        standart: [
          "cssStyleElementEcwidCartTitle2Color",
          "cssStyleElementEcwidCartTitle2TypographyFontFamily",
          "cssStyleElementEcwidCartTitle2TypographyFontSize",
          "cssStyleElementEcwidCartTitle2TypographyLineHeight",
          "cssStyleElementEcwidCartTitle2TypographyFontWeight",
          "cssStyleElementEcwidCartTitle2TypographyLetterSpacing",
          "cssStyleElementEcwidCartTitle2Align"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__cert":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypographyFontFamily",
          "cssStyleElementEcwidCartSubtitleTypographyFontSize",
          "cssStyleElementEcwidCartSubtitleTypographyLineHeight",
          "cssStyleElementEcwidCartSubtitleTypographyFontWeight",
          "cssStyleElementEcwidCartSubtitleTypographyLetterSpacing",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--cartitems .ec-confirmation__wrap .ec-confirmation__title.ec-header-h5":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypographyFontFamily",
          "cssStyleElementEcwidCartSubtitleTypographyFontSize",
          "cssStyleElementEcwidCartSubtitleTypographyLineHeight",
          "cssStyleElementEcwidCartSubtitleTypographyFontWeight",
          "cssStyleElementEcwidCartSubtitleTypographyLetterSpacing",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--contactinfo .ec-confirmation__wrap .ec-confirmation__title.ec-header-h5":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypographyFontFamily",
          "cssStyleElementEcwidCartSubtitleTypographyFontSize",
          "cssStyleElementEcwidCartSubtitleTypographyLineHeight",
          "cssStyleElementEcwidCartSubtitleTypographyFontWeight",
          "cssStyleElementEcwidCartSubtitleTypographyLetterSpacing",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--payment .ec-cart-next__text":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypographyFontFamily",
          "cssStyleElementEcwidCartSubtitleTypographyFontSize",
          "cssStyleElementEcwidCartSubtitleTypographyLineHeight",
          "cssStyleElementEcwidCartSubtitleTypographyFontWeight",
          "cssStyleElementEcwidCartSubtitleTypographyLetterSpacing",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--orderinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypographyFontFamily",
          "cssStyleElementEcwidCartSubtitleTypographyFontSize",
          "cssStyleElementEcwidCartSubtitleTypographyLineHeight",
          "cssStyleElementEcwidCartSubtitleTypographyFontWeight",
          "cssStyleElementEcwidCartSubtitleTypographyLetterSpacing",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--order-confirmation .ec-cart-next__text":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypographyFontFamily",
          "cssStyleElementEcwidCartSubtitleTypographyFontSize",
          "cssStyleElementEcwidCartSubtitleTypographyLineHeight",
          "cssStyleElementEcwidCartSubtitleTypographyFontWeight",
          "cssStyleElementEcwidCartSubtitleTypographyLetterSpacing",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons":
      { standart: ["cssStyleElementEcwidCartButtonSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons div .form-control":
      { standart: ["cssStyleElementEcwidCartButtonAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons div .form-control .form-control__button:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__buttons div .form-control .form-control__button .form-control__button-text":
      {
        standart: [
          "cssStyleElementEcwidCartButtonTypographyFontFamily",
          "cssStyleElementEcwidCartButtonTypographyFontSize",
          "cssStyleElementEcwidCartButtonTypographyLineHeight",
          "cssStyleElementEcwidCartButtonTypographyFontWeight",
          "cssStyleElementEcwidCartButtonTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__button":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSpacing",
          "cssStyleElementEcwidCartButtonAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__button .form-control":
      { standart: ["cssStyleElementEcwidCartButtonWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__button .form-control .form-control__button:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__button .form-control .form-control__button .form-control__button-text":
      {
        standart: [
          "cssStyleElementEcwidCartButtonTypographyFontFamily",
          "cssStyleElementEcwidCartButtonTypographyFontSize",
          "cssStyleElementEcwidCartButtonTypographyLineHeight",
          "cssStyleElementEcwidCartButtonTypographyFontWeight",
          "cssStyleElementEcwidCartButtonTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart-step__body .ec-form .ec-form__row .ec-form__cell":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSpacing",
          "cssStyleElementEcwidCartButtonAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart-step__body .ec-form .ec-form__row .ec-form__cell .form-control":
      { standart: ["cssStyleElementEcwidCartButtonWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart-step__body .ec-form .ec-form__row .ec-form__cell .form-control .form-control__button:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart-step__body .ec-form .ec-form__row .ec-form__cell .form-control .form-control__button .form-control__button-text":
      {
        standart: [
          "cssStyleElementEcwidCartButtonTypographyFontFamily",
          "cssStyleElementEcwidCartButtonTypographyFontSize",
          "cssStyleElementEcwidCartButtonTypographyLineHeight",
          "cssStyleElementEcwidCartButtonTypographyFontWeight",
          "cssStyleElementEcwidCartButtonTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__continue":
      {
        standart: [
          "cssStyleElementEcwidCartButtonSpacing",
          "cssStyleElementEcwidCartButtonAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__continue .form-control":
      { standart: ["cssStyleElementEcwidCartButtonWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__continue .form-control .form-control__button:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__continue .form-control .form-control__button .form-control__button-text":
      {
        standart: [
          "cssStyleElementEcwidCartButtonTypographyFontFamily",
          "cssStyleElementEcwidCartButtonTypographyFontSize",
          "cssStyleElementEcwidCartButtonTypographyLineHeight",
          "cssStyleElementEcwidCartButtonTypographyFontWeight",
          "cssStyleElementEcwidCartButtonTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart-email .ec-cart-email__text":
      {
        standart: [
          "cssStyleElementEcwidCartEmailColor",
          "cssStyleElementEcwidCartEmailTypographyFontFamily",
          "cssStyleElementEcwidCartEmailTypographyFontSize",
          "cssStyleElementEcwidCartEmailTypographyLineHeight",
          "cssStyleElementEcwidCartEmailTypographyFontWeight",
          "cssStyleElementEcwidCartEmailTypographyLetterSpacing",
          "cssStyleElementEcwidCartEmailAlign",
          "cssStyleElementEcwidCartEmailSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__email":
      {
        standart: [
          "cssStyleElementEcwidCartEmailColor",
          "cssStyleElementEcwidCartEmailTypographyFontFamily",
          "cssStyleElementEcwidCartEmailTypographyFontSize",
          "cssStyleElementEcwidCartEmailTypographyLineHeight",
          "cssStyleElementEcwidCartEmailTypographyFontWeight",
          "cssStyleElementEcwidCartEmailTypographyLetterSpacing",
          "cssStyleElementEcwidCartEmailAlign",
          "cssStyleElementEcwidCartEmailSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__agreement":
      { standart: ["cssStyleElementEcwidCartCheckboxSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__checkout .ec-cart__agreement .ec-cart__agreement.ec-cart__marketing-agreement .form-control--checkbox .form-control__inline-label":
      {
        standart: [
          "cssStyleElementEcwidCartCheckboxColor",
          "cssStyleElementEcwidCartCheckboxTypographyFontFamily",
          "cssStyleElementEcwidCartCheckboxTypographyFontSize",
          "cssStyleElementEcwidCartCheckboxTypographyLineHeight",
          "cssStyleElementEcwidCartCheckboxTypographyFontWeight",
          "cssStyleElementEcwidCartCheckboxTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next.ec-cart-next .ec-cart-next__header.ec-header-h4":
      {
        standart: [
          "cssStyleElementEcwidCartNextColor",
          "cssStyleElementEcwidCartNextTypographyFontFamily",
          "cssStyleElementEcwidCartNextTypographyFontSize",
          "cssStyleElementEcwidCartNextTypographyLineHeight",
          "cssStyleElementEcwidCartNextTypographyFontWeight",
          "cssStyleElementEcwidCartNextTypographyLetterSpacing",
          "cssStyleElementEcwidCartNextAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next.ec-cart-next .ec-cart-next__header.ec-header-h4":
      {
        standart: [
          "cssStyleElementEcwidCartNextColor",
          "cssStyleElementEcwidCartNextTypographyFontFamily",
          "cssStyleElementEcwidCartNextTypographyFontSize",
          "cssStyleElementEcwidCartNextTypographyLineHeight",
          "cssStyleElementEcwidCartNextTypographyFontWeight",
          "cssStyleElementEcwidCartNextTypographyLetterSpacing",
          "cssStyleElementEcwidCartNextAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--unpaidstatusinfo .ec-confirmation__wrap .ec-confirmation__title.ec-header-h5":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentColor",
          "cssStyleElementEcwidCartPaymentTypographyFontFamily",
          "cssStyleElementEcwidCartPaymentTypographyFontSize",
          "cssStyleElementEcwidCartPaymentTypographyLineHeight",
          "cssStyleElementEcwidCartPaymentTypographyFontWeight",
          "cssStyleElementEcwidCartPaymentTypographyLetterSpacing",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--orderinfo .ec-confirmation__wrap .ec-confirmation__title .ec-confirmation__number.ec-header-h5":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentColor",
          "cssStyleElementEcwidCartPaymentTypographyFontFamily",
          "cssStyleElementEcwidCartPaymentTypographyFontSize",
          "cssStyleElementEcwidCartPaymentTypographyLineHeight",
          "cssStyleElementEcwidCartPaymentTypographyFontWeight",
          "cssStyleElementEcwidCartPaymentTypographyLetterSpacing",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--payment .ec-cart-next__title":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentColor",
          "cssStyleElementEcwidCartPaymentTypographyFontFamily",
          "cssStyleElementEcwidCartPaymentTypographyFontSize",
          "cssStyleElementEcwidCartPaymentTypographyLineHeight",
          "cssStyleElementEcwidCartPaymentTypographyFontWeight",
          "cssStyleElementEcwidCartPaymentTypographyLetterSpacing",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__next .ec-cart-next__step.ec-cart-next__step--order-confirmation .ec-cart-next__title":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentColor",
          "cssStyleElementEcwidCartPaymentTypographyFontFamily",
          "cssStyleElementEcwidCartPaymentTypographyFontSize",
          "cssStyleElementEcwidCartPaymentTypographyLineHeight",
          "cssStyleElementEcwidCartPaymentTypographyFontWeight",
          "cssStyleElementEcwidCartPaymentTypographyLetterSpacing",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__wrap .ec-cart-step__title":
      {
        standart: [
          "cssStyleElementEcwidCartPaymentColor",
          "cssStyleElementEcwidCartPaymentTypographyFontFamily",
          "cssStyleElementEcwidCartPaymentTypographyFontSize",
          "cssStyleElementEcwidCartPaymentTypographyLineHeight",
          "cssStyleElementEcwidCartPaymentTypographyFontWeight",
          "cssStyleElementEcwidCartPaymentTypographyLetterSpacing",
          "cssStyleElementEcwidCartPaymentAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input":
      { standart: ["cssStyleElementEcwidCartInputSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control":
      { standart: ["cssStyleElementEcwidCartInputAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control:hover .form-control__text:-webkit-autofill":
      {
        standart: ["cssStyleElementEcwidCartInputColorAutofill"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control .form-control__text:hover":
      {
        standart: [
          "cssStyleElementEcwidCartInputHeight",
          "cssStyleElementEcwidCartInputWidth",
          "cssStyleElementEcwidCartInputTypographyFontFamily",
          "cssStyleElementEcwidCartInputTypographyFontSize",
          "cssStyleElementEcwidCartInputTypographyLineHeight",
          "cssStyleElementEcwidCartInputTypographyFontWeight",
          "cssStyleElementEcwidCartInputTypographyLetterSpacing",
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
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__email .ec-cart-email__input .form-control .form-control__placeholder .form-control__placeholder-inner:hover":
      {
        standart: [
          "cssStyleElementEcwidCartInputWidth",
          "cssStyleElementEcwidCartInputTypographyFontFamily",
          "cssStyleElementEcwidCartInputTypographyFontSize",
          "cssStyleElementEcwidCartInputTypographyLineHeight",
          "cssStyleElementEcwidCartInputTypographyFontWeight",
          "cssStyleElementEcwidCartInputTypographyLetterSpacing",
          "cssStyleElementEcwidCartInputColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__title":
      {
        standart: [
          "cssStyleElementEcwidCartProductNameColor",
          "cssStyleElementEcwidCartProductNameTypographyFontFamily",
          "cssStyleElementEcwidCartProductNameTypographyFontSize",
          "cssStyleElementEcwidCartProductNameTypographyLineHeight",
          "cssStyleElementEcwidCartProductNameTypographyFontWeight",
          "cssStyleElementEcwidCartProductNameTypographyLetterSpacing",
          "cssStyleElementEcwidCartProductNameAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__title":
      {
        standart: [
          "cssStyleElementEcwidCartProductNameColor",
          "cssStyleElementEcwidCartProductNameTypographyFontFamily",
          "cssStyleElementEcwidCartProductNameTypographyFontSize",
          "cssStyleElementEcwidCartProductNameTypographyLineHeight",
          "cssStyleElementEcwidCartProductNameTypographyFontWeight",
          "cssStyleElementEcwidCartProductNameTypographyLetterSpacing",
          "cssStyleElementEcwidCartProductNameAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--cartitems .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__title":
      {
        standart: [
          "cssStyleElementEcwidCartProductNameColor",
          "cssStyleElementEcwidCartProductNameTypographyFontFamily",
          "cssStyleElementEcwidCartProductNameTypographyFontSize",
          "cssStyleElementEcwidCartProductNameTypographyLineHeight",
          "cssStyleElementEcwidCartProductNameTypographyFontWeight",
          "cssStyleElementEcwidCartProductNameTypographyLetterSpacing",
          "cssStyleElementEcwidCartProductNameAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options":
      { standart: ["cssStyleElementEcwidCartProductSizeAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option":
      {
        standart: [
          "cssStyleElementEcwidCartProductSizeColor",
          "cssStyleElementEcwidCartProductSizeTypographyFontFamily",
          "cssStyleElementEcwidCartProductSizeTypographyFontSize",
          "cssStyleElementEcwidCartProductSizeTypographyLineHeight",
          "cssStyleElementEcwidCartProductSizeTypographyFontWeight",
          "cssStyleElementEcwidCartProductSizeTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options":
      { standart: ["cssStyleElementEcwidCartProductSizeAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option":
      {
        standart: [
          "cssStyleElementEcwidCartProductSizeColor",
          "cssStyleElementEcwidCartProductSizeTypographyFontFamily",
          "cssStyleElementEcwidCartProductSizeTypographyFontSize",
          "cssStyleElementEcwidCartProductSizeTypographyLineHeight",
          "cssStyleElementEcwidCartProductSizeTypographyFontWeight",
          "cssStyleElementEcwidCartProductSizeTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options":
      { standart: ["cssStyleElementEcwidCartProductSizeAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart__item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__options .ec-cart-item__option":
      {
        standart: [
          "cssStyleElementEcwidCartProductSizeColor",
          "cssStyleElementEcwidCartProductSizeTypographyFontFamily",
          "cssStyleElementEcwidCartProductSizeTypographyFontSize",
          "cssStyleElementEcwidCartProductSizeTypographyLineHeight",
          "cssStyleElementEcwidCartProductSizeTypographyFontWeight",
          "cssStyleElementEcwidCartProductSizeTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart.ec-cart--empty .ec-cart__message":
      {
        standart: [
          "cssStyleElementEcwidCartEmptyColor",
          "cssStyleElementEcwidCartEmptyTypographyFontFamily",
          "cssStyleElementEcwidCartEmptyTypographyFontSize",
          "cssStyleElementEcwidCartEmptyTypographyLineHeight",
          "cssStyleElementEcwidCartEmptyTypographyFontWeight",
          "cssStyleElementEcwidCartEmptyTypographyLetterSpacing",
          "cssStyleElementEcwidCartEmptyAlign",
          "cssStyleElementEcwidCartEmptySpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image":
      { standart: ["cssStyleElementEcwidCartImageSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image":
      { standart: ["cssStyleElementEcwidCartImageSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--cartitems .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image":
      { standart: ["cssStyleElementEcwidCartImageSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--cartitems .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__image .ec-cart-item__picture:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__price .ec-cart-item__price-inner":
      {
        standart: [
          "cssStyleElementEcwidProductPriceColor",
          "cssStyleElementEcwidProductPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__item.ec-cart-item.ec-cart-item--summary .ec-cart-item__sum .ec-cart-item-sum.ec-cart-item-sum--cta":
      {
        standart: [
          "cssStyleElementEcwidProductPriceColor",
          "cssStyleElementEcwidProductPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__price .ec-cart-item__price-inner":
      {
        standart: [
          "cssStyleElementEcwidProductPriceColor",
          "cssStyleElementEcwidProductPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__title":
      {
        standart: [
          "cssStyleElementEcwidCartSummaryTitleColor",
          "cssStyleElementEcwidCartSummaryTitleTypographyFontFamily",
          "cssStyleElementEcwidCartSummaryTitleTypographyFontSize",
          "cssStyleElementEcwidCartSummaryTitleTypographyLineHeight",
          "cssStyleElementEcwidCartSummaryTitleTypographyFontWeight",
          "cssStyleElementEcwidCartSummaryTitleTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__title":
      {
        standart: [
          "cssStyleElementEcwidCartSummaryTitleColor",
          "cssStyleElementEcwidCartSummaryTitleTypographyFontFamily",
          "cssStyleElementEcwidCartSummaryTitleTypographyFontSize",
          "cssStyleElementEcwidCartSummaryTitleTypographyLineHeight",
          "cssStyleElementEcwidCartSummaryTitleTypographyFontWeight",
          "cssStyleElementEcwidCartSummaryTitleTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--unpaidstatusinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section":
      {
        standart: [
          "cssStyleElementEcwidCartSummaryTitleColor",
          "cssStyleElementEcwidCartSummaryTitleTypographyFontFamily",
          "cssStyleElementEcwidCartSummaryTitleTypographyFontSize",
          "cssStyleElementEcwidCartSummaryTitleTypographyLineHeight",
          "cssStyleElementEcwidCartSummaryTitleTypographyFontWeight",
          "cssStyleElementEcwidCartSummaryTitleTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__price .ec-cart-summary__total":
      {
        standart: [
          "cssStyleElementEcwidCartSummaryPriceColor",
          "cssStyleElementEcwidCartSummaryPriceTypographyFontFamily",
          "cssStyleElementEcwidCartSummaryPriceTypographyFontSize",
          "cssStyleElementEcwidCartSummaryPriceTypographyLineHeight",
          "cssStyleElementEcwidCartSummaryPriceTypographyFontWeight",
          "cssStyleElementEcwidCartSummaryPriceTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__summary.ec-cart-summary .ec-cart-summary__body .ec-cart-summary__row.ec-cart-summary__row--total .ec-cart-summary__cell.ec-cart-summary__price .ec-cart-summary__total":
      {
        standart: [
          "cssStyleElementEcwidCartSummaryPriceColor",
          "cssStyleElementEcwidCartSummaryPriceTypographyFontFamily",
          "cssStyleElementEcwidCartSummaryPriceTypographyFontSize",
          "cssStyleElementEcwidCartSummaryPriceTypographyLineHeight",
          "cssStyleElementEcwidCartSummaryPriceTypographyFontWeight",
          "cssStyleElementEcwidCartSummaryPriceTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--unpaidstatusinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-confirmation__order-confirmation-total":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypographyFontFamily",
          "cssStyleElementEcwidCartSubtitleTypographyFontSize",
          "cssStyleElementEcwidCartSubtitleTypographyLineHeight",
          "cssStyleElementEcwidCartSubtitleTypographyFontWeight",
          "cssStyleElementEcwidCartSubtitleTypographyLetterSpacing",
          "cssStyleElementEcwidCartSubtitleAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__shopping.ec-cart-shopping":
      { standart: ["cssStyleElementEcwidMyAccountConnectLinkAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__shopping.ec-cart-shopping .ec-cart-shopping__wrap":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectTypographyFontFamily",
          "cssStyleElementEcwidMyAccountConnectTypographyFontSize",
          "cssStyleElementEcwidMyAccountConnectTypographyLineHeight",
          "cssStyleElementEcwidMyAccountConnectTypographyFontWeight",
          "cssStyleElementEcwidMyAccountConnectTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountConnectColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__shopping.ec-cart-shopping .ec-cart-shopping__wrap .ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectLinkTypographyFontFamily",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyFontSize",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyLineHeight",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyFontWeight",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountConnectLinkColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section":
      { standart: ["cssStyleElementEcwidMyAccountConnectLinkAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__text":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectTypographyFontFamily",
          "cssStyleElementEcwidMyAccountConnectTypographyFontSize",
          "cssStyleElementEcwidMyAccountConnectTypographyLineHeight",
          "cssStyleElementEcwidMyAccountConnectTypographyFontWeight",
          "cssStyleElementEcwidMyAccountConnectTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountConnectColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__body .ec-cart__body-inner .ec-cart__steps .ec-cart-step .ec-cart-step__block .ec-cart-step__wrap .ec-cart-step__body .ec-cart-step__section .ec-cart-step__change:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectLinkTypographyFontFamily",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyFontSize",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyLineHeight",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyFontWeight",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountConnectLinkColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--contactinfo .ec-confirmation__wrap .ec-confirmation__body":
      { standart: ["cssStyleElementEcwidMyAccountConnectLinkAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--contactinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectTypographyFontFamily",
          "cssStyleElementEcwidMyAccountConnectTypographyFontSize",
          "cssStyleElementEcwidMyAccountConnectTypographyLineHeight",
          "cssStyleElementEcwidMyAccountConnectTypographyFontWeight",
          "cssStyleElementEcwidMyAccountConnectTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountConnectColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step.ec-confirmation__step--contactinfo .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidMyAccountConnectLinkTypographyFontFamily",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyFontSize",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyLineHeight",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyFontWeight",
          "cssStyleElementEcwidMyAccountConnectLinkTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountConnectLinkColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count.ec-cart-item__count--select .ec-cart-item__count-inner:hover .form-control--select-inline.form-control.ec-link":
      {
        standart: [
          "cssStyleElementEcwidProductQtyColor",
          "cssStyleElementEcwidCartQtyTypographyFontFamily",
          "cssStyleElementEcwidCartQtyTypographyFontSize",
          "cssStyleElementEcwidCartQtyTypographyLineHeight",
          "cssStyleElementEcwidCartQtyTypographyFontWeight",
          "cssStyleElementEcwidCartQtyTypographyLetterSpacing"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count.ec-cart-item__count--select .ec-cart-item__count-inner .form-control--select-inline.form-control.ec-link .form-control__select option:hover":
      {
        standart: [
          "cssStyleElementEcwidProductQtyColor",
          "cssStyleElementEcwidCartQtyTypographyFontFamily",
          "cssStyleElementEcwidCartQtyTypographyFontSize",
          "cssStyleElementEcwidCartQtyTypographyLineHeight",
          "cssStyleElementEcwidCartQtyTypographyFontWeight",
          "cssStyleElementEcwidCartQtyTypographyLetterSpacing"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count .ec-cart-item__count-inner:hover":
      {
        standart: [
          "cssStyleElementEcwidProductQtyColor",
          "cssStyleElementEcwidCartQtyTypographyFontFamily",
          "cssStyleElementEcwidCartQtyTypographyFontSize",
          "cssStyleElementEcwidCartQtyTypographyLineHeight",
          "cssStyleElementEcwidCartQtyTypographyFontWeight",
          "cssStyleElementEcwidCartQtyTypographyLetterSpacing"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-confirmation .ec-confirmation__steps .ec-confirmation__step .ec-confirmation__wrap .ec-confirmation__body .ec-confirmation__section .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count .ec-cart-item__count-inner:hover":
      {
        standart: [
          "cssStyleElementEcwidProductQtyColor",
          "cssStyleElementEcwidCartQtyTypographyFontFamily",
          "cssStyleElementEcwidCartQtyTypographyFontSize",
          "cssStyleElementEcwidCartQtyTypographyLineHeight",
          "cssStyleElementEcwidCartQtyTypographyFontWeight",
          "cssStyleElementEcwidCartQtyTypographyLetterSpacing"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-secondary .ec-cart-item__count .ec-cart-item__count-inner .form-control .form-control__text:hover":
      {
        standart: [
          "cssStyleElementEcwidProductQtyColor",
          "cssStyleElementEcwidCartQtyTypographyFontFamily",
          "cssStyleElementEcwidCartQtyTypographyFontSize",
          "cssStyleElementEcwidCartQtyTypographyLineHeight",
          "cssStyleElementEcwidCartQtyTypographyFontWeight",
          "cssStyleElementEcwidCartQtyTypographyLetterSpacing"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__control .ec-cart-item__control-inner:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__control .ec-cart-item__control-inner svg":
      { standart: ["cssStyleElementEcwidCartCloseSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-storefront-v2 div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-cart .ec-cart__sidebar .ec-cart__sidebar-inner .ec-cart__products .ec-cart__products-inner .ec-cart-item .ec-cart-item__wrap .ec-cart-item__wrap-primary .ec-cart-item__sku.ec-text-muted":
      {
        standart: [
          "cssStyleElementEcwidProductSKUAlign",
          "cssStyleElementEcwidProductSKUSpacing",
          "cssStyleElementEcwidProductSKUColor",
          "cssStyleElementEcwidProductSKUTypography"
        ]
      }
  };

  return renderStyles({ v, vs, vd, styles }) as [string, string, string];
}
