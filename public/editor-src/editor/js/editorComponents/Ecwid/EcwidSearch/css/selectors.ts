export const containerSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid";
export const filtersProductsSelector = `${containerSelector} .ec-store .grid__filters .ec-filters__products`;
export const popupSelectorMobile =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters.ec-filters--popup";
export const popupBlockWrapSelectorMobile = `${popupSelectorMobile} .ec-filters__body .ec-openable-block__wrap`;
export const popupBlockButtonsWrapSelectorMobile = `${popupSelectorMobile} .filter-section-sticky-bar::before`;
export const popupBlockButtonsWrapSelectorMobile2 = `${popupSelectorMobile} .filters-sticky-bar::before`;
export const titleSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-page-title .page-title__name.ec-header-h1:hover";
export const titleSelectorMobile = `${popupSelectorMobile} .ec-filters__top .ec-filters__title.ec-header-h2:hover`;
export const titlePopupFilterItemSelectorMobile = `${popupSelectorMobile} .ec-filter .ec-filter__body .ec-filter__top .ec-filter__title.ec-header-h2:hover`;
export const searchResultsWrapperSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-page-title .ec-breadcrumbs";
export const searchResultsSelector = `${searchResultsWrapperSelector} .breadcrumbs__link--last:hover`;
export const refineBySelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-grid .grid__sort .form-control.grid-sort__item--filter .form-control__select-text:hover";
export const dropdownTitleSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters .ec-filters__body .ec-filter__head";
export const dropdownTitleTextSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters .ec-filters__body .ec-filter .ec-filter__head .ec-filter__name:hover";
export const dropdownTitleHeadTextSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters .ec-filters__body .ec-filter .ec-filter__head .ec-filter__name:hover";
export const formControlSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters .ec-filters__body .ec-filter .ec-filter__body .ec-filter__items .form-control:hover";
export const popupInputSelectorMobile = `${popupSelectorMobile} .ec-filters__search-block input`;
export const filtersResultsHeadSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters .ec-filters__wrap .ec-filters__summary .ec-filters__applied-head";
export const filtersResultsSelector = `${filtersResultsHeadSelector} .ec-filter__name`;

const secondaryTextSelectorClearAll =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters .ec-filters__summary .ec-filters__clear-all-link:hover";
const secondaryTextSelectorMobileClearAll = `${popupSelectorMobile} .ec-filters__clear-all-link:hover`;
const secondaryTextSelectorClearRange =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters .ec-filters__body .ec-filter .ec-filter__head .ec-filters__clear-link:hover";
const secondaryTextSelectorRangeLimit =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters .ec-filter .ec-range .ec-range__limits .ec-range__limit:hover";
const secondaryTextSelectorCount =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters .ec-filter .ec-filter__body .ec-filter__items-count:hover";
const secondaryTextPriceSelectorMobile = `${popupSelectorMobile} .ec-filters__body .ec-filter .ec-filter__items-applied:hover`;
export const secondaryTextSelectors = [
  secondaryTextSelectorClearAll,
  secondaryTextSelectorClearRange,
  secondaryTextSelectorRangeLimit,
  secondaryTextSelectorCount,
  secondaryTextSelectorMobileClearAll,
  secondaryTextPriceSelectorMobile
].join(",");

export const filtersActiveSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters .ec-filters__applied .ec-pill";
export const showItemsSelectorMobile = `${popupSelectorMobile} .filter-section-sticky-bar .form-control .form-control__button:hover`;
export const applyButtonSelectorMobile = `${popupSelectorMobile} .filters-sticky-bar .form-control .form-control__button:hover`;
export const rangeSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-filters .ec-filter .ec-range";
export const footerSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link:hover";
export const footerIconWrapper =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon";
export const footerIcon =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-footer .ec-footer__row .ec-footer__cell a.ec-footer__link .svg-icon svg:hover";
export const productCardSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store  .ec-filters__products .grid-product";
export const noResultsSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store  .ec-filters__products .ec-search .search__notice";
export const sortBySelectSelector =
  "#ecwid_html #ecwid_body &&.brz-ecwid-search-wrapper .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-grid .grid__sort .grid-sort__item--sortby";
