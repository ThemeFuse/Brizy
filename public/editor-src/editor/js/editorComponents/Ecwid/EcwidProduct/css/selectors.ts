const optionColorSelector =
  "#ecwid_html #ecwid_body {{WRAPPER}} .ecwid .ecwid-productBrowser .ec-wrapper .ec-store .ec-store__content-wrapper .product-details .product-details__sidebar .product-details__product-options.details-product-options .product-details-module.details-product-option.details-product-option--swatches";
export const optionColorWrapperSelector = `${optionColorSelector} .product-details-module__content`;
export const optionColorItemSelector = `${optionColorWrapperSelector} .product-details-options__swatches--item`;
export const optionColorSelectedItemSelector = `${optionColorWrapperSelector} .product-details-options__swatches--item .options-swatches-item__color`;
export const optionColorTooltipSelector = `${optionColorItemSelector} .ui-tooltip .ui-tooltip__container`;
