import { WithRenderContext } from "visual/providers/RenderProvider";
import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleDisplayFlex,
  cssStyleDisplayNone,
  cssStyleFlexHorizontalAlign,
  cssStyleSizePadding,
  cssStyleSpacing,
  cssStyleTextAlign,
  getAllCssStyleTypography
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";

// Style Sorting Option
export function cssStyleElementEcwidProductsSortingDisplay({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  return dvv("sortingOptions") === "off"
    ? cssStyleDisplayNone()
    : cssStyleDisplayFlex();
}

export function cssStyleElementEcwidProductsSortingTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sortingTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductsSortingSize({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSizePadding({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sorting"
  });
}

export function cssStyleElementEcwidProductsSortingColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sortingColor"
  });
}

export function cssStyleElementEcwidProductsSortingBgColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sortingBg"
  });
}

export function cssStyleElementEcwidProductsSortingBgGradient({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sorting"
  });
}

export function cssStyleElementEcwidProductsSortingBorder({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sorting"
  });
}

export function cssStyleElementEcwidProductsSortingBorderRadius({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sorting"
  });
}

export function cssStyleElementEcwidProductsSortingBoxShadow({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sorting"
  });
}

export function cssStyleElementEcwidProductsSortingAlign({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sorting"
  });
}

export function cssStyleElementEcwidProductsSortingSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sorting",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductsSortingSpacingRight({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sortingRight",
    direction: "right"
  });
}

// Style Products
export function cssStyleElementEcwidProductsBgColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "productsBg"
  });
}

export function cssStyleElementEcwidProductsBgGradient({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "products"
  });
}

export function cssStyleElementEcwidProductsBorder({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "products"
  });
}

export function cssStyleElementEcwidProductsBoxShadow({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "products"
  });
}

export function cssStyleElementEcwidProductsGalleryLabelDisplay({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const editLabel = dvv("editLabel");

  return editLabel === "off" ? cssStyleDisplayNone() : cssStyleDisplayFlex();
}

export function cssStyleElementEcwidProductsGalleryBottomSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "galleryBottom",
    direction: "bottom"
  });
}

// Style SKU
export function cssStyleElementEcwidProductsSKUTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "skuTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductsSKUColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "skuColor"
  });
}

export function cssStyleElementEcwidProductsSKUSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "sku",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductsSubtitleSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "subtitle",
    direction: "bottom"
  });
}

// Style Count pages
export function cssStyleElementEcwidProductsCountPagesTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "countPagesTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductsCountPagesColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "countPagesColor"
  });
}

export function cssStyleElementEcwidProductsCountPagesAlign({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "countPages"
  });
}

export function cssStyleElementEcwidProductsCountPagesSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "countPages",
    direction: "bottom"
  });
}

// Style Pagination
export function cssStyleElementEcwidProductsPaginationTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "paginationTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductsPaginationSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "pagination",
    direction: "bottom"
  });
}

// Style Featured Products Title
export function cssStyleElementEcwidProductsFeaturedProductsTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "featuredProductsTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductsFeaturedProductsColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "featuredProductsColor"
  });
}

export function cssStyleElementEcwidProductsFeaturedProductsAlign({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "featuredProducts"
  });
}

export function cssStyleElementEcwidProductsFeaturedProductsSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "featuredProducts",
    direction: "bottom"
  });
}

// Style Label
export function cssStyleElementEcwidProductsLabelTypography({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "labelTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductsLabelBorderRadius({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "label"
  });
}

export function cssStyleElementEcwidProductsBuyButton({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  // need to check
  return cssStyleSizePadding({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "button"
  });
}

export function cssStyleElementEcwidProductsGallerySize({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  return dvv("galleryWidth") === "custom"
    ? `width: calc(100%/${dvv("galleryCustomSize")});`
    : "";
}
