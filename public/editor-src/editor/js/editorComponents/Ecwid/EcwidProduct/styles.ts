import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types/Value";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser:hover":
      {
        standart: [
          "cssStyleElementEcwidProductBgColor",
          "cssStyleElementEcwidProductBgGradient",
          "cssStyleElementEcwidProductBorder",
          "cssStyleElementEcwidProductBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar":
      { standart: ["cssStyleElementEcwidProductPaddingSidebar"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__gallery":
      { standart: ["cssStyleElementEcwidProductPaddingGallery"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-title.ec-header-h3":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description .product-details__product-title.ec-header-h3":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__top .product-details__product-title.ec-header-h3":
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
    "#ecwid_html #ecwid_body .ecwid-pswp #ecwid-pswp-template .pswp__scroll-wrap .pswp__ui .pswp__caption .pswp__caption__center":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .ec-breadcrumbs":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsAlign",
          "cssStyleElementEcwidProductBreadcrumbsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description .ec-breadcrumbs":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsAlign",
          "cssStyleElementEcwidProductBreadcrumbsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__top .ec-breadcrumbs":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsAlign",
          "cssStyleElementEcwidProductBreadcrumbsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .ec-breadcrumbs .breadcrumbs__link":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsColor",
          "cssStyleElementEcwidProductBreadcrumbsTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description .ec-breadcrumbs .breadcrumbs__link":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsColor",
          "cssStyleElementEcwidProductBreadcrumbsTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__top .ec-breadcrumbs .breadcrumbs__link":
      {
        standart: [
          "cssStyleElementEcwidProductBreadcrumbsColor",
          "cssStyleElementEcwidProductBreadcrumbsTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-row .product-details-module__content .product-details__product-price.ec-price-item":
      {
        standart: [
          "cssStyleElementEcwidProductPriceAlign",
          "cssStyleElementEcwidProductPriceSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-row .product-details-module__content .product-details__product-price.ec-price-item .details-product-price__value.ec-price-item":
      {
        standart: [
          "cssStyleElementEcwidProductPriceColor",
          "cssStyleElementEcwidProductPriceTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__action-panel.details-product-purchase .product-details-module__title.ec-header-h6.details-product-purchase__place":
      {
        standart: [
          "cssStyleElementEcwidProductInStockAlign",
          "cssStyleElementEcwidProductInStockSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__action-panel.details-product-purchase .product-details-module__title.ec-header-h6.details-product-purchase__place span":
      {
        standart: [
          "cssStyleElementEcwidProductInStockColor",
          "cssStyleElementEcwidProductInStockTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content.product-details-module__content--indented .details-product-purchase__controls .details-product-purchase__bag-controls .details-product-purchase__add-buttons .form-control.form-control--button.form-control--large":
      {
        standart: [
          "cssStyleElementEcwidMyAccountButtonWidth",
          "cssStyleElementEcwidMyAccountButtonAlign",
          "cssStyleElementEcwidCartButtonSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content.product-details-module__content--indented .details-product-purchase__controls .details-product-purchase__bag-controls .details-product-purchase__add-buttons .form-control.form-control--button.form-control--large.form-control--secondary.form-control--flexible.form-control--animated.details-product-purchase__add-more":
      { standart: ["cssStyleElementEcwidProductButtonRightSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content.product-details-module__content--indented .details-product-purchase__controls .details-product-purchase__bag-controls .details-product-purchase__add-buttons .form-control.form-control--button.form-control--large .form-control__button":
      {
        standart: [
          "cssStyleElementEcwidMyAccountButtonSize",
          "cssStyleElementEcwidMyAccountButtonColor",
          "cssStyleElementEcwidMyAccountButtonBgColor",
          "cssStyleElementEcwidMyAccountButtonBgGradient",
          "cssStyleElementEcwidMyAccountButtonBorder",
          "cssStyleElementEcwidMyAccountButtonBoxShadow",
          "cssStyleElementEcwidMyAccountButtonBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content.product-details-module__content--indented .details-product-purchase__controls .details-product-purchase__bag-controls .details-product-purchase__add-buttons .form-control.form-control--button.form-control--large .form-control__button .form-control__button-text":
      {
        standart: [
          "cssStyleElementEcwidMyAccountButtonTypographyFontFamily",
          "cssStyleElementEcwidMyAccountButtonTypographyFontSize",
          "cssStyleElementEcwidMyAccountButtonTypographyLineHeight",
          "cssStyleElementEcwidMyAccountButtonTypographyFontWeight",
          "cssStyleElementEcwidMyAccountButtonTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__controls .details-product-purchase__checkout-controls":
      {
        standart: [
          "cssStyleElementEcwidProductCheckoutSpacing",
          "cssStyleElementEcwidMyAccountButtonAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__controls .details-product-purchase__checkout-controls .form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.details-product-purchase__checkout":
      { standart: ["cssStyleElementEcwidProductCheckoutWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__controls .details-product-purchase__checkout-controls .form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.details-product-purchase__checkout:hover .form-control__button":
      {
        standart: [
          "cssStyleElementEcwidProductCheckoutSize",
          "cssStyleElementEcwidProductCheckoutColor",
          "cssStyleElementEcwidProductCheckoutBgColor",
          "cssStyleElementEcwidProductCheckoutBgGradient",
          "cssStyleElementEcwidProductCheckoutBorder",
          "cssStyleElementEcwidProductCheckoutBoxShadow",
          "cssStyleElementEcwidProductCheckoutBorderRadius"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__controls .details-product-purchase__checkout-controls .form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.details-product-purchase__checkout .form-control__button .form-control__button-text":
      { standart: ["cssStyleElementEcwidProductCheckoutTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__controls .details-product-purchase__add-buttons":
      { standart: ["cssStyleElementEcwidMyAccountButtonAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__controls .details-product-purchase__add-buttons .form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.form-control--animated.details-product-purchase__add-to-bag.form-control__button--icon-center.form-control--done":
      { standart: ["cssStyleElementEcwidProductAddToBagWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__controls .details-product-purchase__add-buttons .form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.form-control--animated.details-product-purchase__add-to-bag.form-control__button--icon-center.form-control--done:hover .form-control__button":
      {
        standart: [
          "cssStyleElementEcwidProductAddToBagSize",
          "cssStyleElementEcwidProductAddToBagColor",
          "cssStyleElementEcwidProductAddToBagBgColor",
          "cssStyleElementEcwidProductAddToBagBgGradient",
          "cssStyleElementEcwidProductAddToBagBorder",
          "cssStyleElementEcwidProductAddToBagBoxShadow",
          "cssStyleElementEcwidProductAddToBagBorderRadius"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__controls .details-product-purchase__add-buttons .form-control.form-control--button.form-control--large.form-control--primary.form-control--flexible.form-control--animated.details-product-purchase__add-to-bag.form-control__button--icon-center.form-control--done .form-control__button .form-control__button-text":
      { standart: ["cssStyleElementEcwidProductAddToBagTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__general-info .product-details-module__title.ec-header-h6":
      {
        standart: [
          "cssStyleElementEcwidProductDetailsColor",
          "cssStyleElementEcwidProductDetailsTypography",
          "cssStyleElementEcwidProductDetailsAlign",
          "cssStyleElementEcwidProductDetailsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description .product-details-module.product-details__general-info .product-details-module__title.ec-header-h6":
      {
        standart: [
          "cssStyleElementEcwidProductDetailsColor",
          "cssStyleElementEcwidProductDetailsTypography",
          "cssStyleElementEcwidProductDetailsAlign",
          "cssStyleElementEcwidProductDetailsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description div .product-details-module__title.ec-header-h6":
      {
        standart: [
          "cssStyleElementEcwidProductDetailsColor",
          "cssStyleElementEcwidProductDetailsTypography",
          "cssStyleElementEcwidProductDetailsAlign",
          "cssStyleElementEcwidProductDetailsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar div .product-details-module__title.ec-header-h6":
      {
        standart: [
          "cssStyleElementEcwidProductDetailsColor",
          "cssStyleElementEcwidProductDetailsTypography",
          "cssStyleElementEcwidProductDetailsAlign",
          "cssStyleElementEcwidProductDetailsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option .product-details-module__title":
      {
        standart: [
          "cssStyleElementEcwidProductSizeColor",
          "cssStyleElementEcwidProductSizeTypography",
          "cssStyleElementEcwidProductSizeAlign",
          "cssStyleElementEcwidProductSizeSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--radio":
      { standart: ["cssStyleElementEcwidProductRadioSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--radio .product-details-module__content .form-control--radio":
      { standart: ["cssStyleElementEcwidProductRadioColumns"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--radio .product-details-module__content .form-control--radio:hover .form-control__inline-label label":
      {
        standart: [
          "cssStyleElementEcwidProductRadioColor",
          "cssStyleElementEcwidProductRadioTypography"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--radio .product-details-module__content .form-control--radio .form-control__radio-wrap":
      { standart: ["cssStyleElementEcwidProductRadioIconSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--radio .product-details-module__content .form-control--radio:hover .form-control__radio-wrap .form-control__radio-view:after":
      {
        standart: [
          "cssStyleElementEcwidProductRadioColorIcon",
          "cssStyleElementEcwidProductRadioBorderColorIcon"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--checkbox":
      { standart: ["cssStyleElementEcwidProductCheckbox2Spacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--checkbox .product-details-module__content .form-control--checkbox":
      { standart: ["cssStyleElementEcwidProductCheckbox2Columns"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--checkbox .product-details-module__content .form-control--checkbox .form-control__checkbox-wrap .form-control__checkbox-view":
      { standart: ["cssStyleElementEcwidProductCheckbox2IconSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--checkbox .product-details-module__content .form-control--checkbox:hover .form-control__checkbox-wrap .form-control__checkbox-view:after":
      {
        standart: [
          "cssStyleElementEcwidProductCheckbox2ColorIcon",
          "cssStyleElementEcwidProductCheckbox2BorderColorIcon"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--checkbox .product-details-module__content .form-control--checkbox .form-control__inline-label label":
      {
        standart: [
          "cssStyleElementEcwidProductCheckbox2Color",
          "cssStyleElementEcwidProductCheckbox2Typography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--textfield .product-details-module__content .form-control .form-control__text:-webkit-autofill":
      { standart: ["cssStyleElementEcwidProductTextFieldColorFocus"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--textfield .product-details-module__content .form-control .form-control__text":
      {
        standart: [
          "cssStyleElementEcwidProductTextFieldPlaceholder",
          "cssStyleElementEcwidProductTextFieldTypography",
          "cssStyleElementEcwidProductTextFieldColor",
          "cssStyleElementEcwidProductTextFieldPadding"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--textfield .product-details-module__content .form-control .form-control__placeholder":
      { standart: ["cssStyleElementEcwidProductTextFieldSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--textfield .product-details-module__content .form-control .form-control__placeholder .form-control__placeholder-inner:hover":
      {
        standart: [
          "cssStyleElementEcwidProductTextFieldPlaceholder",
          "cssStyleElementEcwidProductTextFieldTypography"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--textfield":
      { standart: ["cssStyleElementEcwidProductTextFieldSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--textfield .product-details-module__content":
      { standart: ["cssStyleElementEcwidProductTextFieldAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--textfield .product-details-module__content .form-control:hover":
      {
        standart: [
          "cssStyleElementEcwidProductTextFieldColor",
          "cssStyleElementEcwidProductTextFieldBgColor",
          "cssStyleElementEcwidProductTextFieldBgGradient",
          "cssStyleElementEcwidProductTextFieldBorder",
          "cssStyleElementEcwidProductTextFieldBorderRadius",
          "cssStyleElementEcwidProductTextFieldBoxShadow",
          "cssStyleElementEcwidProductTextFieldAlign",
          "cssStyleElementEcwidProductTextFieldWidth",
          "cssStyleElementEcwidProductTextFieldSize"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--textarea":
      { standart: ["cssStyleElementEcwidProductTextareaSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--textarea .product-details-module__content .form-control--textarea .form-control__placeholder":
      { standart: ["cssStyleElementEcwidProductTextareaSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--textarea .product-details-module__content .form-control--textarea:hover .form-control__textarea":
      {
        standart: [
          "cssStyleElementEcwidProductTextareaSize",
          "cssStyleElementEcwidProductTextareaHeight",
          "cssStyleElementEcwidProductTextareaWidth",
          "cssStyleElementEcwidProductTextareaBgColor",
          "cssStyleElementEcwidProductTextareaBgGradient",
          "cssStyleElementEcwidProductTextareaBorder",
          "cssStyleElementEcwidProductTextareaBorderRadius",
          "cssStyleElementEcwidProductTextareaBoxShadow",
          "cssStyleElementEcwidProductTextareaColor",
          "cssStyleElementEcwidProductTextareaTypography"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--textarea .product-details-module__content .form-control--textarea:hover .form-control__placeholder .form-control__placeholder-inner":
      {
        standart: [
          "cssStyleElementEcwidProductTextareaPlaceholder",
          "cssStyleElementEcwidProductTextareaColor",
          "cssStyleElementEcwidProductTextareaTypography"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--select":
      { standart: ["cssStyleElementEcwidProductSelectSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--select .product-details-module__content":
      { standart: ["cssStyleElementEcwidProductSelectAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--select .product-details-module__content .form-control--select":
      {
        standart: [
          "cssStyleElementEcwidProductSelectColor",
          "cssStyleElementEcwidProductSelectBgColor",
          "cssStyleElementEcwidProductSelectBgGradient",
          "cssStyleElementEcwidProductSelectBorder",
          "cssStyleElementEcwidProductSelectBorderRadius",
          "cssStyleElementEcwidProductSelectBoxShadow",
          "cssStyleElementEcwidProductSelectWidth",
          "cssStyleElementEcwidProductSelectSize"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--select .product-details-module__content .form-control--select .form-control__text":
      {
        standart: [
          "cssStyleElementEcwidProductSelectPlaceholder",
          "cssStyleElementEcwidProductSelectTypography",
          "cssStyleElementEcwidProductSelectPadding"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--select .product-details-module__content .form-control--select .form-control__arrow svg":
      { standart: ["cssStyleElementEcwidProductSelectIconSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--select .product-details-module__content .form-control--select .form-control__select option":
      {
        standart: [
          "cssStyleElementEcwidProductSelectColor",
          "cssStyleElementEcwidProductSelectBgColor",
          "cssStyleElementEcwidProductSelectBgGradient",
          "cssStyleElementEcwidProductSelectBorder",
          "cssStyleElementEcwidProductSelectBorderRadius",
          "cssStyleElementEcwidProductSelectBoxShadow",
          "cssStyleElementEcwidProductSelectWidth",
          "cssStyleElementEcwidProductSelectSize",
          "cssStyleElementEcwidProductSelectTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--date .product-details-module__content .form-control .form-control__text:-webkit-autofill":
      { standart: ["cssStyleElementEcwidProductDatepickerColorFocus"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--date .product-details-module__content .form-control .form-control__text":
      {
        standart: [
          "cssStyleElementEcwidProductDatepickerPlaceholder",
          "cssStyleElementEcwidProductDatepickerTypography",
          "cssStyleElementEcwidProductDatepickerColor",
          "cssStyleElementEcwidProductDatepickerPadding"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--date .product-details-module__content .form-control .form-control__placeholder":
      { standart: ["cssStyleElementEcwidProductDatepickerSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--date .product-details-module__content .form-control .form-control__placeholder .form-control__placeholder-inner:hover":
      {
        standart: [
          "cssStyleElementEcwidProductDatepickerPlaceholder",
          "cssStyleElementEcwidProductDatepickerTypography"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--date .product-details-module__content":
      { standart: ["cssStyleElementEcwidProductDatepickerAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--date":
      { standart: ["cssStyleElementEcwidProductDatepickerSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--date .product-details-module__content .form-control:hover":
      {
        standart: [
          "cssStyleElementEcwidProductDatepickerColor",
          "cssStyleElementEcwidProductDatepickerBgColor",
          "cssStyleElementEcwidProductDatepickerBgGradient",
          "cssStyleElementEcwidProductDatepickerBorder",
          "cssStyleElementEcwidProductDatepickerBorderRadius",
          "cssStyleElementEcwidProductDatepickerBoxShadow",
          "cssStyleElementEcwidProductDatepickerAlign",
          "cssStyleElementEcwidProductDatepickerWidth",
          "cssStyleElementEcwidProductDatepickerSize"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--files":
      { standart: ["cssStyleElementEcwidProductFilesSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--files .product-details-module__content .form-control.form-control--file .form-control":
      { standart: ["cssStyleElementEcwidProductFilesAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--files .product-details-module__content .form-control.form-control--file .form-control .form-control__button:hover .form-control__button-text":
      {
        standart: [
          "cssStyleElementEcwidProductFilesTypography",
          "cssStyleElementEcwidProductFilesColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--files .product-details-module__content .form-control.form-control--file .form-control .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidProductFilesBgColor",
          "cssStyleElementEcwidProductFilesBgGradient",
          "cssStyleElementEcwidProductFilesBorder",
          "cssStyleElementEcwidProductFilesBorderRadius",
          "cssStyleElementEcwidProductFilesBoxShadow",
          "cssStyleElementEcwidProductFilesSize",
          "cssStyleElementEcwidProductFilesWidth"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--files .product-details-module__content .form-control.form-control--file .form-control__add-more:hover":
      {
        standart: [
          "cssStyleElementEcwidProductFilesBgColor",
          "cssStyleElementEcwidProductFilesBgGradient",
          "cssStyleElementEcwidProductFilesBorder",
          "cssStyleElementEcwidProductFilesBorderRadius",
          "cssStyleElementEcwidProductFilesBoxShadow",
          "cssStyleElementEcwidProductFilesSize",
          "cssStyleElementEcwidProductFilesWidth",
          "cssStyleElementEcwidProductFilesTypography",
          "cssStyleElementEcwidProductFilesColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__general-info .product-details-module__content .product-details__product-description":
      {
        standart: [
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontFamily",
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontSize",
          "cssStyleElementEcwidMyAccountDescriptionTypographyLineHeight",
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontWeight",
          "cssStyleElementEcwidMyAccountDescriptionTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountDescriptionColor",
          "cssStyleElementEcwidMyAccountDescriptionAlign",
          "cssStyleElementEcwidMyAccountDescriptionSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description .product-details-module.product-details__general-info .product-details-module__content .product-details__product-description":
      {
        standart: [
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontFamily",
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontSize",
          "cssStyleElementEcwidMyAccountDescriptionTypographyLineHeight",
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontWeight",
          "cssStyleElementEcwidMyAccountDescriptionTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountDescriptionColor",
          "cssStyleElementEcwidMyAccountDescriptionAlign",
          "cssStyleElementEcwidMyAccountDescriptionSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__general-info .product-details-module__content .product-details__product-description div p strong":
      {
        standart: [
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontFamily",
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontSize",
          "cssStyleElementEcwidMyAccountDescriptionTypographyLineHeight",
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontWeight",
          "cssStyleElementEcwidMyAccountDescriptionTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description .product-details-module.product-details__general-info .product-details__product-description":
      {
        standart: [
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontFamily",
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontSize",
          "cssStyleElementEcwidMyAccountDescriptionTypographyLineHeight",
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontWeight",
          "cssStyleElementEcwidMyAccountDescriptionTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountDescriptionColor",
          "cssStyleElementEcwidMyAccountDescriptionAlign",
          "cssStyleElementEcwidMyAccountDescriptionSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description .product-details-module.product-details__general-info .product-details__product-description div p":
      {
        standart: [
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontFamily",
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontSize",
          "cssStyleElementEcwidMyAccountDescriptionTypographyLineHeight",
          "cssStyleElementEcwidMyAccountDescriptionTypographyFontWeight",
          "cssStyleElementEcwidMyAccountDescriptionTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__title.ec-header-h6.favorite-product__title":
      {
        standart: [
          "cssStyleElementEcwidMyAccountTitle2TypographyFontFamily",
          "cssStyleElementEcwidMyAccountTitle2TypographyFontSize",
          "cssStyleElementEcwidMyAccountTitle2TypographyLineHeight",
          "cssStyleElementEcwidMyAccountTitle2TypographyFontWeight",
          "cssStyleElementEcwidMyAccountTitle2TypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountTitle2Color",
          "cssStyleElementEcwidMyAccountTitle2Align",
          "cssStyleElementEcwidMyAccountTitle2Spacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--size .product-details-module__content":
      { standart: ["cssStyleElementEcwidProductCheckboxAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--size .product-details-module__content .form-control--checkbox-button":
      {
        standart: [
          "cssStyleElementEcwidProductCheckboxSpacingRight",
          "cssStyleElementEcwidProductCheckboxSpacingBottom"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--size .product-details-module__content .form-control--checkbox-button .form-control__inline-label label:hover":
      {
        standart: [
          "cssStyleElementEcwidProductCheckboxTypography",
          "cssStyleElementEcwidProductCheckboxSize",
          "cssStyleElementEcwidProductCheckboxBorderRadius",
          "cssStyleElementEcwidProductCheckboxBgColor",
          "cssStyleElementEcwidProductCheckboxBgGradient",
          "cssStyleElementEcwidProductCheckboxBorder",
          "cssStyleElementEcwidProductCheckboxBoxShadow",
          "cssStyleElementEcwidProductCheckboxColor",
          "cssStyleElementEcwidProductCheckboxPadding"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--size .product-details-module__content .form-control--checkbox-button .form-control__radio:checked~.form-control__inline-label label":
      {
        standart: [
          "cssStyleElementEcwidProductCheckboxTypography",
          "cssStyleElementEcwidProductCheckboxSize",
          "cssStyleElementEcwidProductCheckboxBorderRadius",
          "cssStyleElementEcwidProductCheckboxActiveBgColor",
          "cssStyleElementEcwidProductCheckboxActiveBgGradient",
          "cssStyleElementEcwidProductCheckboxActiveBorder",
          "cssStyleElementEcwidProductCheckboxActiveBoxShadow",
          "cssStyleElementEcwidProductCheckboxActiveColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--size .product-details-module__content .form-control--checkbox-button input":
      { standart: ["cssStyleElementEcwidProductCheckboxSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-share.details-product-share .product-details-module .product-details-module__title.ec-header-h6.details-product-share__title":
      {
        standart: [
          "cssStyleElementEcwidProductShareTitleColor",
          "cssStyleElementEcwidProductShareTitleTypography",
          "cssStyleElementEcwidProductShareTitleAlign",
          "cssStyleElementEcwidProductShareTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--my-account":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--track-order":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--shopping-cart":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.ec-link.ec-link--muted":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon":
      { standart: ["cssStyleElementEcwidCartFooterIconSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon svg":
      {
        standart: [
          "cssStyleElementEcwidCartFooterIconSize",
          "cssStyleElementEcwidCartFooterIconColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product":
      { standart: ["cssStyleElementEcwidProductFavoritesButtonsDisplay"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented":
      { standart: ["cssStyleElementEcwidProductFavoriteAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-add":
      {
        standart: [
          "cssStyleElementEcwidProductFavoriteSpacing",
          "cssStyleElementEcwidProductFavoriteWidth",
          "cssStyleElementEcwidProductFavoriteButtonSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-add .form-control__button.form-control__button--icon-prepend:hover":
      {
        standart: [
          "cssStyleElementEcwidProductFavoriteSize",
          "cssStyleElementEcwidProductFavoriteColor",
          "cssStyleElementEcwidProductFavoriteBgColor",
          "cssStyleElementEcwidProductFavoriteBgGradient",
          "cssStyleElementEcwidProductFavoriteBorder",
          "cssStyleElementEcwidProductFavoriteBorderRadius",
          "cssStyleElementEcwidProductFavoriteBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-add .form-control__button.form-control__button--icon-prepend .form-control__button-text":
      { standart: ["cssStyleElementEcwidProductFavoriteTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-add .form-control__button.form-control__button--icon-prepend .form-control__button-svg":
      {
        standart: [
          "cssStyleElementEcwidProductFavoriteSpacingRightIcon",
          "cssStyleElementEcwidProductFavoriteIconSize"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-add .form-control__button.form-control__button--icon-prepend .form-control__button-svg .svg-icon":
      { standart: ["cssStyleElementEcwidProductFavoriteIconSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-saved":
      {
        standart: [
          "cssStyleElementEcwidProductFavoritedSpacing",
          "cssStyleElementEcwidProductFavoritedWidth",
          "cssStyleElementEcwidProductFavoritedButtonSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-saved .form-control__button.form-control__button--icon-prepend:hover":
      {
        standart: [
          "cssStyleElementEcwidProductFavoritedSize",
          "cssStyleElementEcwidProductFavoritedColor",
          "cssStyleElementEcwidProductFavoritedBgColor",
          "cssStyleElementEcwidProductFavoritedBgGradient",
          "cssStyleElementEcwidProductFavoritedBorder",
          "cssStyleElementEcwidProductFavoritedBorderRadius",
          "cssStyleElementEcwidProductFavoritedBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-saved .form-control__button.form-control__button--icon-prepend .form-control__button-text":
      { standart: ["cssStyleElementEcwidProductFavoritedTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-saved .form-control__button.form-control__button--icon-prepend .form-control__button-svg":
      {
        standart: [
          "cssStyleElementEcwidProductFavoritedSpacingRightIcon",
          "cssStyleElementEcwidProductFavoritedIconSize"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-saved .form-control__button.form-control__button--icon-prepend .form-control__button-svg .svg-icon":
      { standart: ["cssStyleElementEcwidProductFavoritedIconSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-view":
      {
        standart: [
          "cssStyleElementEcwidProductViewFavoritesSpacing",
          "cssStyleElementEcwidProductViewFavoritesWidth"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-view .form-control__button:hover":
      {
        standart: [
          "cssStyleElementEcwidProductViewFavoritesSize",
          "cssStyleElementEcwidProductViewFavoritesColor",
          "cssStyleElementEcwidProductViewFavoritesBgColor",
          "cssStyleElementEcwidProductViewFavoritesBgGradient",
          "cssStyleElementEcwidProductViewFavoritesBorder",
          "cssStyleElementEcwidProductViewFavoritesBorderRadius",
          "cssStyleElementEcwidProductViewFavoritesBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-like.favorite-product .product-details-module__content.product-details-module__content--indented .form-control.form-control--button.form-control--medium.form-control--secondary.form-control--done.favorite-product__button-view .form-control__button .form-control__button-text":
      { standart: ["cssStyleElementEcwidProductViewFavoritesTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-share.details-product-share .product-details-module .product-details-module__content.product-details-module__content--indented .ec-likely.details-product-share__buttons .ec-likely__wrapper .ec-likely__widget .ec-likely__button":
      { standart: ["cssStyleElementEcwidProductShareButtonsTypography"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-share.details-product-share .product-details-module .product-details-module__content.product-details-module__content--indented .ec-likely.details-product-share__buttons .ec-likely__wrapper .ec-likely__widget .ec-likely__icon":
      {
        standart: [
          "cssStyleElementEcwidProductShareButtonsSpacingRightIcon",
          "cssStyleElementEcwidProductShareButtonsIconSize"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-share.details-product-share .product-details-module .product-details-module__content.product-details-module__content--indented .ec-likely.details-product-share__buttons .ec-likely__wrapper .ec-likely__widget .ec-likely__icon svg":
      { standart: ["cssStyleElementEcwidProductShareButtonsIconSize"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-share.details-product-share .product-details-module .product-details-module__content.product-details-module__content--indented .ec-likely.details-product-share__buttons .ec-likely__wrapper":
      { standart: ["cssStyleElementEcwidProductShareButtonsAlign"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-share.details-product-share .product-details-module .product-details-module__content.product-details-module__content--indented .ec-likely.details-product-share__buttons .ec-likely__wrapper .ec-likely__widget:hover":
      {
        standart: [
          "cssStyleElementEcwidProductShareButtonsSize",
          "cssStyleElementEcwidProductShareButtonsWidth",
          "cssStyleElementEcwidProductShareButtonsColor",
          "cssStyleElementEcwidProductShareButtonsBgColor",
          "cssStyleElementEcwidProductShareButtonsBgGradient",
          "cssStyleElementEcwidProductShareButtonsBorder",
          "cssStyleElementEcwidProductShareButtonsBorderRadius",
          "cssStyleElementEcwidProductShareButtonsBoxShadow",
          "cssStyleElementEcwidProductShareButtonsSpacing",
          "cssStyleElementEcwidProductShareButtonsSpacingRight"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__gallery .details-gallery__wrap":
      {
        standart: [
          "cssStyleElementEcwidProductGalleryWidth",
          "cssStyleElementEcwidProductGalleryAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__gallery .details-gallery__wrap .details-gallery__wrap-inner .details-gallery__images":
      { standart: ["cssStyleElementEcwidProductThumbnailSpacingRightBottom"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__gallery .details-gallery__wrap .details-gallery__wrap-inner .details-gallery__images .details-gallery__images-container .details-gallery__images-carousel .details-gallery__image":
      { standart: ["cssStyleElementEcwidProductThumbnailSpacingStyleCenter"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__gallery .details-gallery__wrap .details-gallery__wrap-inner .details-gallery__images .details-gallery__images-container .details-gallery__images-carousel .details-gallery__image:first-child .details-gallery__image-wrapper .details-gallery__image-wrapper-inner:hover":
      {
        standart: [
          "cssStyleElementEcwidProductGalleryBorder",
          "cssStyleElementEcwidProductGalleryBorderRadius",
          "cssStyleElementEcwidProductGalleryBoxShadow"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__gallery .details-gallery__wrap .details-gallery__wrap-inner .details-gallery__thumbs":
      { standart: ["cssStyleElementEcwidProductThumbnailWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__gallery .details-gallery__wrap .details-gallery__wrap-inner .details-gallery__thumbs .details-gallery__thumb:not(.details-gallery__thumb.details-gallery__thumb--active):hover":
      {
        standart: [
          "cssStyleElementWOOGalleryBorderThumbnail",
          "cssStyleElementWOOGalleryBorderRadiusThumbnail",
          "cssStyleElementWOOGalleryBoxShadowThumbnail",
          "cssStyleElementEcwidProductThumbnailBetween",
          "cssStyleElementEcwidProductThumbnailWidthCenter"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__gallery .details-gallery__wrap .details-gallery__wrap-inner .details-gallery__images .details-gallery__images-container .details-gallery__images-carousel .details-gallery__image:not(:first-child) .details-gallery__image-wrapper .details-gallery__image-wrapper-inner:hover":
      {
        standart: [
          "cssStyleElementWOOGalleryBorderThumbnail",
          "cssStyleElementWOOGalleryBorderRadiusThumbnail",
          "cssStyleElementWOOGalleryBoxShadowThumbnail",
          "cssStyleElementEcwidProductThumbnailBetween"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__gallery .details-gallery__wrap .details-gallery__wrap-inner .details-gallery__thumbs .details-gallery__thumb.details-gallery__thumb--active":
      {
        standart: [
          "cssStyleElementEcwidProductThumbnailActiveBorder",
          "cssStyleElementEcwidProductThumbnailActiveBoxShadow",
          "cssStyleElementWOOGalleryBorderRadiusThumbnail",
          "cssStyleElementEcwidProductThumbnailBetween",
          "cssStyleElementEcwidProductThumbnailWidthCenter"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-row .product-details-module__content .product-details__attraction-block .product-details__label-container:hover .ec-label":
      {
        standart: ["cssStyleElementEcwidProductFlagColorBg"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-row .product-details-module__content .product-details__attraction-block .product-details__label-container:hover .ec-label:after":
      {
        standart: ["cssStyleElementEcwidProductFlagColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-row .product-details-module__content .product-details__attraction-block .product-details__label-container:hover .ec-label:before":
      {
        standart: ["cssStyleElementEcwidProductFlagColor"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-row .product-details-module__content .product-details__attraction-block .product-details__label-container:hover .ec-label .label__text":
      {
        standart: [
          "cssStyleElementEcwidProductFlagLabelTypography",
          "cssStyleElementEcwidProductFlagLabelColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-row .product-details-module__content .product-details__attraction-block .product-details__label-container":
      {
        standart: [
          "cssStyleElementEcwidProductFlagLabelAlign",
          "cssStyleElementEcwidProductFlagSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-sku.ec-text-muted":
      {
        standart: [
          "cssStyleElementEcwidProductSKUAlign",
          "cssStyleElementEcwidProductSKUSpacing",
          "cssStyleElementEcwidProductSKUColor",
          "cssStyleElementEcwidProductSKUTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__qty":
      {
        standart: [
          "cssStyleElementEcwidProductQtyAlign",
          "cssStyleElementEcwidProductQtySpacingBottom"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__qty label .details-product-purchase__qty-label:hover":
      {
        standart: [
          "cssStyleElementEcwidCartQtyTypographyFontFamily",
          "cssStyleElementEcwidCartQtyTypographyFontSize",
          "cssStyleElementEcwidCartQtyTypographyLineHeight",
          "cssStyleElementEcwidCartQtyTypographyFontWeight",
          "cssStyleElementEcwidCartQtyTypographyLetterSpacing",
          "cssStyleElementEcwidProductQtyColor",
          "cssStyleElementEcwidProductQtySpacingRight"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__qty .form-control:hover .form-control__placeholder":
      {
        standart: [
          "cssStyleElementEcwidCartQtyTypographyFontFamily",
          "cssStyleElementEcwidCartQtyTypographyFontSize",
          "cssStyleElementEcwidCartQtyTypographyLineHeight",
          "cssStyleElementEcwidCartQtyTypographyFontWeight",
          "cssStyleElementEcwidCartQtyTypographyLetterSpacing",
          "cssStyleElementEcwidProductQtyColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__qty .form-control:hover .form-control__placeholder .form-control__placeholder-inner":
      {
        standart: [
          "cssStyleElementEcwidCartQtyTypographyFontFamily",
          "cssStyleElementEcwidCartQtyTypographyFontSize",
          "cssStyleElementEcwidCartQtyTypographyLineHeight",
          "cssStyleElementEcwidCartQtyTypographyFontWeight",
          "cssStyleElementEcwidCartQtyTypographyLetterSpacing",
          "cssStyleElementEcwidProductQtyColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__qty .form-control:hover":
      {
        standart: [
          "cssStyleElementEcwidProductQtyWidth",
          "cssStyleElementEcwidProductQtyColor",
          "cssStyleElementEcwidProductQtyBgColor",
          "cssStyleElementEcwidProductQtyBgGradient",
          "cssStyleElementEcwidProductQtyBorder",
          "cssStyleElementEcwidProductQtyBorderRadius",
          "cssStyleElementEcwidProductQtyBoxShadow"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__content .details-product-purchase__qty .form-control .form-control__text":
      {
        standart: [
          "cssStyleElementEcwidProductQtyHeight",
          "cssStyleElementEcwidCartQtyTypographyFontFamily",
          "cssStyleElementEcwidCartQtyTypographyFontSize",
          "cssStyleElementEcwidCartQtyTypographyLineHeight",
          "cssStyleElementEcwidCartQtyTypographyFontWeight",
          "cssStyleElementEcwidCartQtyTypographyLetterSpacing",
          "cssStyleElementEcwidProductQtyColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description .product-details-module.product-details__general-info .product-details-module__content .product-details__product-attributes .details-product-attribute":
      {
        standart: [
          "cssStyleElementEcwidProductAttributeAlign",
          "cssStyleElementEcwidProductAttributeColor",
          "cssStyleElementEcwidProductAttributeSpacing",
          "cssStyleElementEcwidProductAttributeTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description .product-details-module.product-details__general-info .product-details-module__content .product-details__product-weight .details-product-attribute":
      {
        standart: [
          "cssStyleElementEcwidProductAttributeAlign",
          "cssStyleElementEcwidProductAttributeColor",
          "cssStyleElementEcwidProductAttributeSpacing",
          "cssStyleElementEcwidProductAttributeTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar div .product-details__product-attributes .details-product-attribute":
      {
        standart: [
          "cssStyleElementEcwidProductAttributeAlign",
          "cssStyleElementEcwidProductAttributeColor",
          "cssStyleElementEcwidProductAttributeSpacing",
          "cssStyleElementEcwidProductAttributeTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar div .product-details__product-weight .details-product-attribute":
      {
        standart: [
          "cssStyleElementEcwidProductAttributeAlign",
          "cssStyleElementEcwidProductAttributeColor",
          "cssStyleElementEcwidProductAttributeSpacing",
          "cssStyleElementEcwidProductAttributeTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description div .product-details__product-attributes .details-product-attribute":
      {
        standart: [
          "cssStyleElementEcwidProductAttributeAlign",
          "cssStyleElementEcwidProductAttributeColor",
          "cssStyleElementEcwidProductAttributeSpacing",
          "cssStyleElementEcwidProductAttributeTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__description div .product-details__product-weight .details-product-attribute":
      {
        standart: [
          "cssStyleElementEcwidProductAttributeAlign",
          "cssStyleElementEcwidProductAttributeColor",
          "cssStyleElementEcwidProductAttributeSpacing",
          "cssStyleElementEcwidProductAttributeTypography"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__general-info .product-details-module__btn-more":
      {
        standart: [
          "cssStyleElementEcwidProductShowMoreAlign",
          "cssStyleElementEcwidProductShowMoreSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__general-info .product-details-module__btn-more .ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidProductShowMoreColor",
          "cssStyleElementEcwidProductShowMoreTypography"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__subtitle":
      { standart: ["cssStyleElementEcwidCartSubtitleSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__subtitle .product-details-module__content":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-row .product-details-module__content .product-details__attraction-block.product-details__product-on-sale .details-product-price-compare__container":
      {
        standart: [
          "cssStyleElementEcwidProductWholesalePriceAlign",
          "cssStyleElementEcwidProductWholesalePriceSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-row .product-details-module__content .product-details__attraction-block.product-details__product-on-sale .details-product-price-compare__container .details-product-price-compare__value":
      {
        standart: [
          "cssStyleElementEcwidProductWholesaleColor",
          "cssStyleElementEcwidProductWholesaleTypography",
          "cssStyleElementEcwidProductWholesalePriceRightSpacing",
          "cssStyleElementEcwidProductWholesalePriceColumn"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-row .product-details-module__content .product-details__attraction-block.product-details__product-on-sale .details-product-price-compare__container .product-details__product-price-discount":
      {
        standart: [
          "cssStyleElementEcwidProductWholesalePriceColor",
          "cssStyleElementEcwidProductWholesalePriceTypography",
          "cssStyleElementEcwidProductWholesalePriceColumn"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-row .product-details-module__content .product-details__product-price-wholesale-note":
      {
        standart: [
          "cssStyleElementEcwidProductWholesaleNoteColor",
          "cssStyleElementEcwidProductWholesaleNoteTypography",
          "cssStyleElementEcwidProductWholesaleNoteAlign",
          "cssStyleElementEcwidProductWholesaleNoteSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--radio .form-control__inline-label label .option-surcharge":
      {
        standart: [
          "cssStyleElementEcwidProductSurchargeTypography",
          "cssStyleElementEcwidProductSurchargeColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options .product-details-module .product-details-module__content .form-control--checkbox-button .form-control__inline-label label .option-surcharge":
      {
        standart: [
          "cssStyleElementEcwidProductSurchargeTypography",
          "cssStyleElementEcwidProductSurchargeColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options .product-details-module .product-details-module__content .form-control--checkbox .form-control__inline-label label .option-surcharge":
      {
        standart: [
          "cssStyleElementEcwidProductSurchargeTypography",
          "cssStyleElementEcwidProductSurchargeColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module .product-details-module__title.ec-header-h6.details-product-price-wholesale__title":
      {
        standart: [
          "cssStyleElementEcwidProductWholesaleTitleColor",
          "cssStyleElementEcwidProductWholesaleTitleTypography",
          "cssStyleElementEcwidProductWholesaleTitleAlign",
          "cssStyleElementEcwidProductWholesaleTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-wholesale":
      { standart: ["cssStyleElementEcwidProductWholesaleTableBodySpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-wholesale .product-details-module__content .details-product-price-wholesale__container .details-product-price-wholesale__table thead .details-product-wholesale__header .details-product-wholesale__column":
      {
        standart: [
          "cssStyleElementEcwidProductWholesaleTableHeaderColor",
          "cssStyleElementEcwidProductWholesaleTableHeaderTypography",
          "cssStyleElementEcwidProductWholesaleTableHeaderAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-wholesale .product-details-module__content .details-product-price-wholesale__container .details-product-price-wholesale__table tbody .details-product-wholesale__row .details-product-wholesale__column":
      {
        standart: [
          "cssStyleElementEcwidProductWholesaleTableBodyColor",
          "cssStyleElementEcwidProductWholesaleTableBodyTypography",
          "cssStyleElementEcwidProductWholesaleTableBodyAlign"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details-module.product-details__product-price-wholesale .product-details-module__content .details-product-price-wholesale__container .details-product-price-wholesale__table tbody .details-product-wholesale__row .details-product-wholesale__column .details-product__wholesale-off":
      {
        standart: [
          "cssStyleElementEcwidProductWholesaleTableBodyColor",
          "cssStyleElementEcwidProductWholesaleTableBodyTypography",
          "cssStyleElementEcwidProductWholesaleTableBodyAlign"
        ]
      }
  };

  return renderStyles({ v, vs, vd, styles }) as [string, string, string];
}
