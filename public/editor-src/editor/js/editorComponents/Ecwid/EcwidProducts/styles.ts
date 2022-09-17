import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./types/Value";

export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser":
      {
        standart: [
          "cssStyleElementEcwidProductsBgColor",
          "cssStyleElementEcwidProductsBgGradient",
          "cssStyleElementEcwidProductsBorder",
          "cssStyleElementEcwidProductsBoxShadow"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--my-account":
      {
        standart: [
          "cssStyleElementEcwidMyAccountFooterColor",
          "cssStyleElementEcwidMyAccountFooterTypographyFontFamily",
          "cssStyleElementEcwidMyAccountFooterTypographyFontSize",
          "cssStyleElementEcwidMyAccountFooterTypographyLineHeight",
          "cssStyleElementEcwidMyAccountFooterTypographyFontWeight",
          "cssStyleElementEcwidMyAccountFooterTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--track-order":
      {
        standart: [
          "cssStyleElementEcwidMyAccountFooterColor",
          "cssStyleElementEcwidMyAccountFooterTypographyFontFamily",
          "cssStyleElementEcwidMyAccountFooterTypographyFontSize",
          "cssStyleElementEcwidMyAccountFooterTypographyLineHeight",
          "cssStyleElementEcwidMyAccountFooterTypographyFontWeight",
          "cssStyleElementEcwidMyAccountFooterTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.footer__link--shopping-cart":
      {
        standart: [
          "cssStyleElementEcwidMyAccountFooterColor",
          "cssStyleElementEcwidMyAccountFooterTypographyFontFamily",
          "cssStyleElementEcwidMyAccountFooterTypographyFontSize",
          "cssStyleElementEcwidMyAccountFooterTypographyLineHeight",
          "cssStyleElementEcwidMyAccountFooterTypographyFontWeight",
          "cssStyleElementEcwidMyAccountFooterTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link.ec-link.ec-link--muted":
      {
        standart: [
          "cssStyleElementEcwidMyAccountFooterColor",
          "cssStyleElementEcwidMyAccountFooterTypographyFontFamily",
          "cssStyleElementEcwidMyAccountFooterTypographyFontSize",
          "cssStyleElementEcwidMyAccountFooterTypographyLineHeight",
          "cssStyleElementEcwidMyAccountFooterTypographyFontWeight",
          "cssStyleElementEcwidMyAccountFooterTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon":
      { standart: ["cssStyleElementEcwidMyAccountFooterIconSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon svg":
      {
        standart: [
          "cssStyleElementEcwidMyAccountFooterIconSize",
          "cssStyleElementEcwidMyAccountFooterIconColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__title .grid-product__title-inner":
      {
        standart: [
          "cssStyleElementEcwidMyAccountTitleTypographyFontFamily",
          "cssStyleElementEcwidMyAccountTitleTypographyFontSize",
          "cssStyleElementEcwidMyAccountTitleTypographyLineHeight",
          "cssStyleElementEcwidMyAccountTitleTypographyFontWeight",
          "cssStyleElementEcwidMyAccountTitleTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountTitleColor",
          "cssStyleElementEcwidMyAccountTitleSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__image .grid-product__hover-wrap .grid-product__title-hover":
      { standart: ["cssStyleElementEcwidMyAccountTitleSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__image .grid-product__hover-wrap .grid-product__title-hover .grid-product__title-inner":
      {
        standart: [
          "cssStyleElementEcwidMyAccountTitleTypographyFontFamily",
          "cssStyleElementEcwidMyAccountTitleTypographyFontSize",
          "cssStyleElementEcwidMyAccountTitleTypographyLineHeight",
          "cssStyleElementEcwidMyAccountTitleTypographyFontWeight",
          "cssStyleElementEcwidMyAccountTitleTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountTitleColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__price":
      { standart: ["cssStyleElementEcwidMyAccountShopTitleSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__image .grid-product__hover-wrap .grid-product__price-hover .grid-product__price-amount":
      {
        standart: [
          "cssStyleElementEcwidMyAccountShopTitleSpacing",
          "cssStyleElementEcwidMyAccountShopTitleTypographyFontFamily",
          "cssStyleElementEcwidMyAccountShopTitleTypographyFontSize",
          "cssStyleElementEcwidMyAccountShopTitleTypographyLineHeight",
          "cssStyleElementEcwidMyAccountShopTitleTypographyFontWeight",
          "cssStyleElementEcwidMyAccountShopTitleTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountShopTitleColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__price .grid-product__price-amount":
      {
        standart: [
          "cssStyleElementEcwidMyAccountShopTitleTypographyFontFamily",
          "cssStyleElementEcwidMyAccountShopTitleTypographyFontSize",
          "cssStyleElementEcwidMyAccountShopTitleTypographyLineHeight",
          "cssStyleElementEcwidMyAccountShopTitleTypographyFontWeight",
          "cssStyleElementEcwidMyAccountShopTitleTypographyLetterSpacing",
          "cssStyleElementEcwidMyAccountShopTitleColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__sort.ec-text-muted":
      {
        standart: [
          "cssStyleElementEcwidProductsSortingSpacing",
          "cssStyleElementEcwidProductsSortingAlign",
          "cssStyleElementEcwidProductsSortingDisplay"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__sort.ec-text-muted .form-control.form-control--select-inline.grid-sort__item.grid-sort__item--sortby:hover .form-control__select option":
      {
        standart: [
          "cssStyleElementEcwidProductsSortingTypographyFontFamily",
          "cssStyleElementEcwidProductsSortingTypographyFontSize",
          "cssStyleElementEcwidProductsSortingTypographyLineHeight",
          "cssStyleElementEcwidProductsSortingTypographyFontWeight",
          "cssStyleElementEcwidProductsSortingTypographyLetterSpacing",
          "cssStyleElementEcwidProductsSortingColor",
          "cssStyleElementEcwidProductsSortingBgColor",
          "cssStyleElementEcwidProductsSortingBgGradient",
          "cssStyleElementEcwidProductsSortingBorder",
          "cssStyleElementEcwidProductsSortingBorderRadius",
          "cssStyleElementEcwidProductsSortingBoxShadow",
          "cssStyleElementEcwidProductsSortingSize"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__sort.ec-text-muted .form-control.form-control--select-inline.grid-sort__item.grid-sort__item--sortby:hover label":
      {
        standart: [
          "cssStyleElementEcwidProductsSortingSpacingRight",
          "cssStyleElementEcwidProductsSortingColor",
          "cssStyleElementEcwidProductsSortingTypographyFontFamily",
          "cssStyleElementEcwidProductsSortingTypographyFontSize",
          "cssStyleElementEcwidProductsSortingTypographyLineHeight",
          "cssStyleElementEcwidProductsSortingTypographyFontWeight",
          "cssStyleElementEcwidProductsSortingTypographyLetterSpacing"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__sort.ec-text-muted .form-control.form-control--select-inline.grid-sort__item.grid-sort__item--sortby:hover .form-control__arrow:hover":
      {
        standart: [
          "cssStyleElementEcwidProductsSortingColor",
          "cssStyleElementEcwidProductsSortingTypographyFontFamily",
          "cssStyleElementEcwidProductsSortingTypographyFontSize",
          "cssStyleElementEcwidProductsSortingTypographyLineHeight",
          "cssStyleElementEcwidProductsSortingTypographyFontWeight",
          "cssStyleElementEcwidProductsSortingTypographyLetterSpacing"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__sort.ec-text-muted .form-control.form-control--select-inline.grid-sort__item.grid-sort__item--sortby:hover":
      {
        standart: [
          "cssStyleElementEcwidProductsSortingBgColor",
          "cssStyleElementEcwidProductsSortingBgGradient",
          "cssStyleElementEcwidProductsSortingBorder",
          "cssStyleElementEcwidProductsSortingBorderRadius",
          "cssStyleElementEcwidProductsSortingBoxShadow",
          "cssStyleElementEcwidProductsSortingSize"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product":
      {
        standart: [
          "cssStyleElementEcwidProductsGalleryBottomSpacing",
          "cssStyleElementEcwidProductsGallerySize"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__image:hover .grid-product__image-wrap .grid-product__label .ec-label":
      {
        standart: [
          "cssStyleElementEcwidProductsGalleryLabelDisplay",
          "cssStyleElementEcwidProductsLabelBorderRadius"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__image:hover .grid-product__image-wrap .grid-product__label .ec-label .label__text":
      {
        standart: [
          "cssStyleElementEcwidProductsLabelTypographyFontFamily",
          "cssStyleElementEcwidProductsLabelTypographyFontSize",
          "cssStyleElementEcwidProductsLabelTypographyLineHeight",
          "cssStyleElementEcwidProductsLabelTypographyFontWeight",
          "cssStyleElementEcwidProductsLabelTypographyLetterSpacing"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__sku.ec-text-muted":
      {
        standart: [
          "cssStyleElementEcwidProductsSKUTypographyFontFamily",
          "cssStyleElementEcwidProductsSKUTypographyFontSize",
          "cssStyleElementEcwidProductsSKUTypographyLineHeight",
          "cssStyleElementEcwidProductsSKUTypographyFontWeight",
          "cssStyleElementEcwidProductsSKUTypographyLetterSpacing",
          "cssStyleElementEcwidProductsSKUColor",
          "cssStyleElementEcwidProductsSKUSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__image .grid-product__hover-wrap .grid-product__sku-hover":
      {
        standart: [
          "cssStyleElementEcwidProductsSKUTypographyFontFamily",
          "cssStyleElementEcwidProductsSKUTypographyFontSize",
          "cssStyleElementEcwidProductsSKUTypographyLineHeight",
          "cssStyleElementEcwidProductsSKUTypographyFontWeight",
          "cssStyleElementEcwidProductsSKUTypographyLetterSpacing",
          "cssStyleElementEcwidProductsSKUColor",
          "cssStyleElementEcwidProductsSKUSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__button.grid-product__buy-now .form-control.form-control--button":
      { standart: ["cssStyleElementEcwidCartButtonWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__button.grid-product__buy-now .form-control.form-control--button .form-control__button:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__button.grid-product__buy-now .form-control.form-control--button .form-control__button .form-control__button-text":
      {
        standart: [
          "cssStyleElementEcwidCartButtonTypographyFontFamily",
          "cssStyleElementEcwidCartButtonTypographyFontSize",
          "cssStyleElementEcwidCartButtonTypographyLineHeight",
          "cssStyleElementEcwidCartButtonTypographyFontWeight",
          "cssStyleElementEcwidCartButtonTypographyLetterSpacing"
        ]
      },

    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__button.grid-product__buy-now":
      { standart: ["cssStyleElementEcwidCartButtonSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__image .grid-product__hover-wrap .grid-product__button-hover.grid-product__buy-now .form-control.form-control--button":
      { standart: ["cssStyleElementEcwidCartButtonWidth"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__image .grid-product__hover-wrap .grid-product__button-hover.grid-product__buy-now .form-control.form-control--button .form-control__button:hover":
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
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__image .grid-product__hover-wrap .grid-product__button-hover.grid-product__buy-now .form-control.form-control--button .form-control__button .form-control__button-text":
      {
        standart: [
          "cssStyleElementEcwidCartButtonTypographyFontFamily",
          "cssStyleElementEcwidCartButtonTypographyFontSize",
          "cssStyleElementEcwidCartButtonTypographyLineHeight",
          "cssStyleElementEcwidCartButtonTypographyFontWeight",
          "cssStyleElementEcwidCartButtonTypographyLetterSpacing"
        ]
      },

    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__subtitle.ec-text-muted":
      { standart: ["cssStyleElementEcwidProductsSubtitleSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .grid__wrap .grid__wrap-inner .grid__products .grid-product .grid-product__wrap .grid-product__wrap-inner .grid-product__subtitle.ec-text-muted .grid-product__subtitle-inner":
      {
        standart: [
          "cssStyleElementEcwidCartSubtitleColor",
          "cssStyleElementEcwidCartSubtitleTypographyFontFamily",
          "cssStyleElementEcwidCartSubtitleTypographyFontSize",
          "cssStyleElementEcwidCartSubtitleTypographyLineHeight",
          "cssStyleElementEcwidCartSubtitleTypographyFontWeight",
          "cssStyleElementEcwidCartSubtitleTypographyLetterSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-pager .pager__head.ec-text-muted":
      {
        standart: [
          "cssStyleElementEcwidProductsCountPagesAlign",
          "cssStyleElementEcwidProductsCountPagesSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-pager .pager__head.ec-text-muted .pager__count-pages":
      {
        standart: [
          "cssStyleElementEcwidProductsCountPagesTypographyFontFamily",
          "cssStyleElementEcwidProductsCountPagesTypographyFontSize",
          "cssStyleElementEcwidProductsCountPagesTypographyLineHeight",
          "cssStyleElementEcwidProductsCountPagesTypographyFontWeight",
          "cssStyleElementEcwidProductsCountPagesTypographyLetterSpacing",
          "cssStyleElementEcwidProductsCountPagesColor"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-pager .pager__body.pager__body--has-next":
      { standart: ["cssStyleElementEcwidProductsPaginationSpacing"] },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-pager .pager__body.pager__body--has-next .pager__pages .ec-link.ec-link--muted.pager__number:hover":
      {
        standart: [
          "cssStyleElementEcwidProductsPaginationTypographyFontFamily",
          "cssStyleElementEcwidProductsPaginationTypographyFontSize",
          "cssStyleElementEcwidProductsPaginationTypographyLineHeight",
          "cssStyleElementEcwidProductsPaginationTypographyFontWeight",
          "cssStyleElementEcwidProductsPaginationTypographyLetterSpacing",
          "cssStyleElementPostsPaginationColor",
          "cssStyleElementPostsPaginationBgColor",
          "cssStyleElementPostsPaginationBorder",
          "cssStyleElementPostsPaginationBorderRadius"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-pager .pager__body.pager__body--has-next .pager__pages .ec-link.ec-link--muted.pager__number.pager__number--current":
      {
        standart: [
          "cssStyleElementPostsPaginationActiveColor",
          "cssStyleElementPostsPaginationActiveBgColor",
          "cssStyleElementPostsPaginationActiveBorder",
          "cssStyleElementPostsPaginationBorderRadius"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-pager .pager__body.pager__body--has-next .ec-link:hover":
      {
        standart: [
          "cssStyleElementEcwidProductsPaginationTypographyFontFamily",
          "cssStyleElementEcwidProductsPaginationTypographyFontSize",
          "cssStyleElementEcwidProductsPaginationTypographyLineHeight",
          "cssStyleElementEcwidProductsPaginationTypographyFontWeight",
          "cssStyleElementEcwidProductsPaginationTypographyLetterSpacing",
          "cssStyleElementPostsPaginationColor"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionElementEcwid"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .ec-page-title.ec-page-title__featured-products":
      {
        standart: [
          "cssStyleElementEcwidProductsFeaturedProductsAlign",
          "cssStyleElementEcwidProductsFeaturedProductsSpacing"
        ]
      },
    "#ecwid_html #ecwid_body && .ecwid .ec-loader-wrapper div .ecwid-productBrowser div div div .ec-wrapper .ec-store .ec-store__content-wrapper .ec-grid .ec-page-title.ec-page-title__featured-products .page-title__name.ec-header-h1":
      {
        standart: [
          "cssStyleElementEcwidProductsFeaturedProductsTypographyFontFamily",
          "cssStyleElementEcwidProductsFeaturedProductsTypographyFontSize",
          "cssStyleElementEcwidProductsFeaturedProductsTypographyLineHeight",
          "cssStyleElementEcwidProductsFeaturedProductsTypographyFontWeight",
          "cssStyleElementEcwidProductsFeaturedProductsTypographyLetterSpacing",
          "cssStyleElementEcwidProductsFeaturedProductsColor"
        ]
      }
  };

  return renderStyles({ v, vs, vd, styles }) as [string, string, string];
}
