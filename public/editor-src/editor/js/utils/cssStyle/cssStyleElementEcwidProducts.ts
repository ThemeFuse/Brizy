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
  cssStyleTypography3FontFamily,
  cssStyleTypography3FontSize,
  cssStyleTypography3FontWeight,
  cssStyleTypography3LetterSpacing,
  cssStyleTypography3LineHeight
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

export function cssStyleElementEcwidProductsSortingTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "sortingTypography"
  });
}

export function cssStyleElementEcwidProductsSortingTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "sortingTypography"
  });
}

export function cssStyleElementEcwidProductsSortingTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "sortingTypography"
  });
}

export function cssStyleElementEcwidProductsSortingTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "sortingTypography"
  });
}

export function cssStyleElementEcwidProductsSortingTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "sortingTypography"
  });
}

export function cssStyleElementEcwidProductsSortingSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePadding({
    v,
    device,
    state,
    prefix: "sorting"
  });
}

export function cssStyleElementEcwidProductsSortingColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "sortingColor" });
}

export function cssStyleElementEcwidProductsSortingBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "sortingBg" });
}

export function cssStyleElementEcwidProductsSortingBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "sorting" });
}

export function cssStyleElementEcwidProductsSortingBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "sorting" });
}

export function cssStyleElementEcwidProductsSortingBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "sorting" });
}

export function cssStyleElementEcwidProductsSortingBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "sorting" });
}

export function cssStyleElementEcwidProductsSortingAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "sorting" });
}

export function cssStyleElementEcwidProductsSortingSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "sorting",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductsSortingSpacingRight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "sortingRight",
    direction: "right"
  });
}

// Style Products
export function cssStyleElementEcwidProductsBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "productsBg" });
}

export function cssStyleElementEcwidProductsBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "products" });
}

export function cssStyleElementEcwidProductsBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "products" });
}

export function cssStyleElementEcwidProductsBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "products" });
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
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "galleryBottom",
    direction: "bottom"
  });
}

// Style SKU
export function cssStyleElementEcwidProductsSKUTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "skuTypography"
  });
}

export function cssStyleElementEcwidProductsSKUTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "skuTypography"
  });
}

export function cssStyleElementEcwidProductsSKUTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "skuTypography"
  });
}

export function cssStyleElementEcwidProductsSKUTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "skuTypography"
  });
}

export function cssStyleElementEcwidProductsSKUTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "skuTypography"
  });
}

export function cssStyleElementEcwidProductsSKUColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "skuColor" });
}

export function cssStyleElementEcwidProductsSKUSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "sku",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductsSubtitleSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "subtitle",
    direction: "bottom"
  });
}

// Style Count pages
export function cssStyleElementEcwidProductsCountPagesTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "countPagesTypography"
  });
}

export function cssStyleElementEcwidProductsCountPagesTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "countPagesTypography"
  });
}

export function cssStyleElementEcwidProductsCountPagesTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "countPagesTypography"
  });
}

export function cssStyleElementEcwidProductsCountPagesTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "countPagesTypography"
  });
}

export function cssStyleElementEcwidProductsCountPagesTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "countPagesTypography"
  });
}

export function cssStyleElementEcwidProductsCountPagesColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "countPagesColor" });
}

export function cssStyleElementEcwidProductsCountPagesAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "countPages" });
}

export function cssStyleElementEcwidProductsCountPagesSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "countPages",
    direction: "bottom"
  });
}

// Style Pagination
export function cssStyleElementEcwidProductsPaginationTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "paginationTypography"
  });
}

export function cssStyleElementEcwidProductsPaginationTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "paginationTypography"
  });
}

export function cssStyleElementEcwidProductsPaginationTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "paginationTypography"
  });
}

export function cssStyleElementEcwidProductsPaginationTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "paginationTypography"
  });
}

export function cssStyleElementEcwidProductsPaginationTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "paginationTypography"
  });
}

export function cssStyleElementEcwidProductsPaginationSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "pagination",
    direction: "bottom"
  });
}

// Style Featured Products Title
export function cssStyleElementEcwidProductsFeaturedProductsTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "featuredProductsTypography"
  });
}

export function cssStyleElementEcwidProductsFeaturedProductsTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "featuredProductsTypography"
  });
}

export function cssStyleElementEcwidProductsFeaturedProductsTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "featuredProductsTypography"
  });
}

export function cssStyleElementEcwidProductsFeaturedProductsTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "featuredProductsTypography"
  });
}

export function cssStyleElementEcwidProductsFeaturedProductsTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "featuredProductsTypography"
  });
}

export function cssStyleElementEcwidProductsFeaturedProductsColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "featuredProductsColor" });
}

export function cssStyleElementEcwidProductsFeaturedProductsAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "featuredProducts" });
}

export function cssStyleElementEcwidProductsFeaturedProductsSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "featuredProducts",
    direction: "bottom"
  });
}

// Style Label
export function cssStyleElementEcwidProductsLabelTypographyFontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontFamily({
    v,
    device,
    prefix: "labelTypography"
  });
}

export function cssStyleElementEcwidProductsLabelTypographyFontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontSize({
    v,
    device,
    prefix: "labelTypography"
  });
}

export function cssStyleElementEcwidProductsLabelTypographyLineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LineHeight({
    v,
    device,
    prefix: "labelTypography"
  });
}

export function cssStyleElementEcwidProductsLabelTypographyFontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3FontWeight({
    v,
    device,
    prefix: "labelTypography"
  });
}

export function cssStyleElementEcwidProductsLabelTypographyLetterSpacing({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography3LetterSpacing({
    v,
    device,
    prefix: "labelTypography"
  });
}

export function cssStyleElementEcwidProductsLabelBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "label" });
}

export function cssStyleElementEcwidProductsBuyButton({
  v,
  device,
  state
}: CSSValue): string {
  // need to check
  return cssStyleSizePadding({ v, device, state, prefix: "button" });
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
