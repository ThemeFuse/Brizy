import { Str } from "@brizy/readers";
import { WithRenderContext } from "visual/providers/RenderProvider";
import {
  EcwidProductColumns,
  EcwidProductThumb
} from "visual/editorComponents/Ecwid/EcwidProduct/types/Value";
import { checkValue } from "visual/utils/checkValue";
import {
  cssStyleBgColor,
  cssStyleBgColorHex,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleDisplayFlex,
  cssStyleDisplayInlineBlock,
  cssStyleDisplayInlineFlex,
  cssStyleDisplayNone,
  cssStyleFill,
  cssStyleFlexColumnHorizontalAlign,
  cssStyleFlexHorizontalAlign,
  cssStyleMarginAlign,
  cssStyleSizeHeight,
  cssStyleSizePadding,
  cssStyleSizeSpacingWidth,
  cssStyleSizeWidth,
  cssStyleSizeWidthHeight,
  cssStyleSpacing,
  cssStyleSpacingWithPadding,
  cssStyleTextAlign,
  getAllCssStyleTypography
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/reader/number";
import {
  styleAlignHorizontal,
  styleColor,
  styleSizeCustom
} from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";
import { ACTIVE } from "../stateMode";
import {
  cssStyleSizeMinHeightPx,
  cssStyleSizeMinWidth,
  cssStyleSizePaddingSelect,
  getSize
} from "./cssStyleSize";

const getThumbs = checkValue<EcwidProductThumb>([
  EcwidProductThumb.ImgFeed,
  EcwidProductThumb.ImgThumbHorizontal,
  EcwidProductThumb.ImgThumbVertical
]);

const getColumns = checkValue<EcwidProductColumns>([
  EcwidProductColumns.TwoLeft,
  EcwidProductColumns.TwoRight,
  EcwidProductColumns.ThreeRight,
  EcwidProductColumns.ThreeLeft
]);

// Style Price
export function cssStyleElementEcwidProductPriceColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "priceColor" });
}

export function cssStyleElementEcwidProductPriceTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "priceTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductPriceAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "price" });
}

export function cssStyleElementEcwidProductPriceSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "price",
    direction: "bottom"
  });
}

// Style In Stock
export function cssStyleElementEcwidProductInStockColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "inStockColor" });
}

export function cssStyleElementEcwidProductInStockTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "inStockTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductInStockAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "inStock" });
}

export function cssStyleElementEcwidProductInStockSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "inStock",
    direction: "bottom"
  });
}

// Style Details
export function cssStyleElementEcwidProductDetailsColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "detailsColor" });
}

export function cssStyleElementEcwidProductDetailsTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "detailsTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductDetailsAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "details" });
}

export function cssStyleElementEcwidProductDetailsSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "details",
    direction: "bottom"
  });
}

// Style Details
export function cssStyleElementEcwidProductSizeColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "sizeColor" });
}

export function cssStyleElementEcwidProductSizeTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "sizeTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductSizeAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "size" });
}

export function cssStyleElementEcwidProductSizeSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "size",
    direction: "bottom"
  });
}

// Style Checkbox
export function cssStyleElementEcwidProductCheckboxTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "checkboxTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductCheckboxSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const size = getSize(dvv("checkboxSize"));
  const customSizeSuffix = Str.read(dvv("checkboxCustomSizeSuffix")) ?? "px";
  const customSize = styleSizeCustom({
    v,
    device,
    state,
    store,
    prefix: "checkbox"
  });

  switch (size) {
    case "small":
      return `min-width:16px;min-height:16px;`;
    case "medium":
      return `min-width:24px;min-height:24px;`;
    case "large":
      return `min-width:32px;min-height:32px;`;
    case "custom":
      return `min-width:${customSize}${customSizeSuffix};min-height:${customSize}${customSizeSuffix};`;
    case undefined:
      return "";
  }
}

export function cssStyleElementEcwidProductCheckboxPadding({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const size = dvv("checkboxSize");
  const customSize = dvv("checkboxCustomSize");
  const customSizeSuffix = dvv("checkboxCustomSizeSuffix");

  switch (size) {
    case "small":
      return `padding: 16${customSizeSuffix};`;
    case "medium":
      return `padding: 24${customSizeSuffix};`;
    case "large":
      return `padding: 32${customSizeSuffix};`;
    case "custom":
      return `padding: ${customSize}${customSizeSuffix};`;
  }

  return "";
}

export function cssStyleElementEcwidProductCheckboxColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "checkboxColor" });
}

export function cssStyleElementEcwidProductCheckboxBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "checkboxBg" });
}

export function cssStyleElementEcwidProductCheckboxBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxActiveColor({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state: "active",
    store,
    prefix: "checkboxColor"
  });
}

export function cssStyleElementEcwidProductCheckboxActiveBgColor({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state: "active",
    store,
    prefix: "checkboxBg"
  });
}

export function cssStyleElementEcwidProductCheckboxActiveBgGradient({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state: "active",
    store,
    prefix: "checkbox"
  });
}

export function cssStyleElementEcwidProductCheckboxActiveBorder({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    store,
    state: "active",
    prefix: "checkbox"
  });
}

export function cssStyleElementEcwidProductCheckboxActiveBoxShadow({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state: "active",
    store,
    prefix: "checkbox"
  });
}

export function cssStyleElementEcwidProductCheckboxAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const bottom = dvv("checkboxBottomSpacing");
  const bottomSuffix = dvv("checkboxBottomSpacingSuffix");
  const right = dvv("checkboxRightSpacing");
  const rightSuffix = dvv("checkboxRightSpacingSuffix");

  return `margin: 0 ${right}${rightSuffix} ${bottom}${bottomSuffix} 0;`;
}

// Style Share Title
export function cssStyleElementEcwidProductShareTitleColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "shareTitleColor" });
}

export function cssStyleElementEcwidProductShareTitleTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "shareTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductShareTitleAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "shareTitle" });
}

export function cssStyleElementEcwidProductShareTitleSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "shareTitle",
    direction: "bottom"
  });
}

// Style Favorite button
export function cssStyleElementEcwidProductFavoriteTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "favoriteTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductFavoriteSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, store, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "favoriteColor" });
}

export function cssStyleElementEcwidProductFavoriteBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "favoriteBg" });
}

export function cssStyleElementEcwidProductFavoriteBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    prefix: "favorite"
  });
}

export function cssStyleElementEcwidProductFavoriteSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "favorite",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductFavoriteButtonSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "favoriteRight",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductFavoriteSpacingRightIcon({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "favoriteRightIcon",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductFavoriteIconSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidthHeight({
    v,
    device,
    state,
    store,
    prefix: "favoriteIcon"
  });
}

// Style Favorited button
export function cssStyleElementEcwidProductFavoritedTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "favoritedTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductFavoritedSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, store, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "favoritedColor" });
}

export function cssStyleElementEcwidProductFavoritedBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "favoritedBg" });
}

export function cssStyleElementEcwidProductFavoritedBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "favorited",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductFavoritedSpacingRightIcon({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "favoritedRightIcon",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductFavoritedIconSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidthHeight({
    v,
    device,
    state,
    store,
    prefix: "favoritedIcon"
  });
}

export function cssStyleElementEcwidProductFavoritedButtonSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "favoritedRight",
    direction: "right"
  });
}

// Style View Favorites
export function cssStyleElementEcwidProductViewFavoritesTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "viewFavoritesTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductViewFavoritesSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizePadding({
    v,
    device,
    state,
    store,
    prefix: "viewFavorites"
  });
}

export function cssStyleElementEcwidProductViewFavoritesWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({
    v,
    device,
    state,
    store,
    prefix: "viewFavorites"
  });
}

export function cssStyleElementEcwidProductViewFavoritesColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "viewFavoritesColor"
  });
}

export function cssStyleElementEcwidProductViewFavoritesBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    store,
    prefix: "viewFavoritesBg"
  });
}

export function cssStyleElementEcwidProductViewFavoritesBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    prefix: "viewFavorites"
  });
}

export function cssStyleElementEcwidProductViewFavoritesBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "viewFavorites" });
}

export function cssStyleElementEcwidProductViewFavoritesBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    prefix: "viewFavorites"
  });
}

export function cssStyleElementEcwidProductViewFavoritesBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    store,
    prefix: "viewFavorites"
  });
}

export function cssStyleElementEcwidProductViewFavoritesSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "viewFavorites",
    direction: "bottom"
  });
}

// Style Share Buttons
export function cssStyleElementEcwidProductShareButtonsTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "shareButtonsTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductShareButtonsSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const size = getSize(dvv("shareButtonsSize"));
  const height = dvv("shareButtonsHeight");
  const heightSuffix = dvv("shareButtonsHeightSuffix");

  switch (size) {
    case "small":
      return "padding: 11px 26px 11px 0;";
    case "medium":
      return "padding: 14px 42px 14px 0;";
    case "large":
      return "padding: 19px 44px 19px 0;";
    case "custom":
      return `padding: ${height}${heightSuffix} 0;`;
    case undefined:
      return "";
  }
}

export function cssStyleElementEcwidProductShareButtonsWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "shareButtons" });
}

export function cssStyleElementEcwidProductShareButtonsColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "shareButtonsColor"
  });
}

export function cssStyleElementEcwidProductShareButtonsBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "shareButtonsBg" });
}

export function cssStyleElementEcwidProductShareButtonsBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    store,
    prefix: "shareButtons"
  });
}

export function cssStyleElementEcwidProductShareButtonsBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "shareButtons" });
}

export function cssStyleElementEcwidProductShareButtonsBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    prefix: "shareButtons"
  });
}

export function cssStyleElementEcwidProductShareButtonsBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "shareButtons" });
}

export function cssStyleElementEcwidProductShareButtonsAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "shareButtons"
  });
}

export function cssStyleElementEcwidProductShareButtonsSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "shareButtons",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductShareButtonsSpacingRightIcon({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "shareButtonsRightIcon",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductShareButtonsIconSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidthHeight({
    v,
    device,
    state,
    store,
    prefix: "shareButtonsIcon"
  });
}

export function cssStyleElementEcwidProductShareButtonsSpacingRight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "shareButtonsRight",
    direction: "right"
  });
}

// Style Image
export function cssStyleElementEcwidProductGalleryBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "gallery" });
}

export function cssStyleElementEcwidProductGalleryBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "gallery" });
}

export function cssStyleElementEcwidProductGalleryBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "gallery" });
}

export function cssStyleElementEcwidProductGalleryWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeSpacingWidth({
    v,
    device,
    state,
    store,
    prefix: "galleryWidth"
  });
}

export function cssStyleElementEcwidProductGalleryAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleMarginAlign({
    v,
    device,
    state,
    store,
    prefix: "gallery"
  });
}

// Style Thumbnail
export function cssStyleElementEcwidProductThumbnailSpacingRightBottom({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const thumbStyle = getThumbs(dvv("thumbStyle"));

  switch (thumbStyle) {
    case EcwidProductThumb.ImgThumbHorizontal:
      return cssStyleSpacing({
        v,
        device,
        state,
        store,
        prefix: "thumb",
        direction: "bottom"
      });
    case EcwidProductThumb.ImgThumbVertical:
      return cssStyleSpacing({
        v,
        device,
        state,
        store,
        prefix: "thumb",
        direction: "left"
      });
    case EcwidProductThumb.ImgFeed:
    case undefined:
      return "";
  }
}

export function cssStyleElementEcwidProductThumbnailSpacingStyleCenter({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const thumbStyle = getThumbs(dvv("thumbStyle"));

  return thumbStyle === EcwidProductThumb.ImgFeed
    ? cssStyleSpacing({
        v,
        device,
        state,
        store,
        prefix: "thumb",
        direction: "bottom"
      })
    : "";
}

export function cssStyleElementEcwidProductThumbnailBetween({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const thumbStyle = getThumbs(dvv("thumbStyle"));
  const between = dvv("betweenThumbnail");

  switch (thumbStyle) {
    case EcwidProductThumb.ImgThumbHorizontal:
      return `margin: 0 ${between}px 0 0;`;
    case EcwidProductThumb.ImgThumbVertical:
      return `margin: 0 0 ${between}px 0;`;
    case EcwidProductThumb.ImgFeed:
    case undefined:
      return "";
  }
}

export function cssStyleElementEcwidProductThumbnailWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const thumbStyle = getThumbs(dvv("thumbStyle"));

  switch (thumbStyle) {
    case EcwidProductThumb.ImgThumbHorizontal:
    case EcwidProductThumb.ImgThumbVertical:
      return cssStyleSizeSpacingWidth({
        v,
        device,
        state,
        store,
        prefix: "thumbnailWidth"
      });
    case EcwidProductThumb.ImgFeed:
    case undefined:
      return "";
  }
}

export function cssStyleElementEcwidProductThumbnailWidthCenter({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const thumbStyle = getThumbs(dvv("thumbStyle"));

  return thumbStyle === EcwidProductThumb.ImgFeed
    ? cssStyleSizeSpacingWidth({
        v,
        device,
        state,
        store,
        prefix: "thumbnailWidth"
      })
    : "";
}

export function cssStyleElementEcwidProductThumbnailActiveBorder({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    store,
    state: ACTIVE,
    prefix: "thumbnail"
  });
}

export function cssStyleElementEcwidProductThumbnailActiveBoxShadow({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state: ACTIVE,
    store,
    prefix: "thumbnail"
  });
}

export function cssStyleElementEcwidProductFlagSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "flagLabel",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductFlagLabelColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "flagLabelColor"
  });
}

export function cssStyleElementEcwidProductFlagColorBg({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColorHex({
    v,
    device,
    state,
    store,
    prefix: "flagBg"
  });
}

export function cssStyleElementEcwidProductFlagColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "flagBgColor"
  });
}

export function cssStyleElementEcwidProductFlagLabelTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "flagLabelTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductFlagLabelAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "flagLabel" });
}

// Style Checkout
export function cssStyleElementEcwidProductCheckoutTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "checkoutTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductCheckoutSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, store, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "checkoutColor" });
}

export function cssStyleElementEcwidProductCheckoutBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "checkoutBg" });
}

export function cssStyleElementEcwidProductCheckoutBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    prefix: "checkout"
  });
}

export function cssStyleElementEcwidProductCheckoutSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "checkout",
    direction: "bottom"
  });
}

// Style Checkout
export function cssStyleElementEcwidProductAddToBagTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "addToBagTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductAddToBagSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, store, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "addToBagColor" });
}

export function cssStyleElementEcwidProductAddToBagBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "addToBagBg" });
}

export function cssStyleElementEcwidProductAddToBagBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    prefix: "addToBag"
  });
}

export function cssStyleElementEcwidProductAddToBagSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "addToBag",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProducButtonSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const bottom = dvv("buttonSpacing");
  const bottomSuffix = dvv("buttonSpacingSuffix");

  return `margin: 0 0 ${bottom}${bottomSuffix} 0;`;
}

export function cssStyleElementEcwidProductPaddingSidebar({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const between = dvv("between");
  const betweenSuffix = dvv("betweenSuffix");
  const columns = getColumns(dvv("columns"));

  switch (columns) {
    case EcwidProductColumns.TwoLeft:
    case EcwidProductColumns.ThreeLeft:
      return `padding:0 ${between}${betweenSuffix} 0 0;`;
    case EcwidProductColumns.ThreeRight:
    case EcwidProductColumns.TwoRight:
      return `padding:0 0 0 ${between}${betweenSuffix};`;
    case undefined:
      return "";
  }
}

export function cssStyleElementEcwidProductPaddingGallery({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const between = dvv("between");
  const betweenSuffix = dvv("betweenSuffix");
  const columns = getColumns(dvv("columns"));

  switch (columns) {
    case EcwidProductColumns.ThreeLeft:
      return `padding:0 0 0 ${between}${betweenSuffix};`;
    case EcwidProductColumns.ThreeRight:
      return `padding:0 ${between}${betweenSuffix} 0 0;`;
    case EcwidProductColumns.TwoRight:
    case EcwidProductColumns.TwoLeft:
    case undefined:
      return "";
  }
}

export function cssStyleElementEcwidProductBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "productBg" });
}

export function cssStyleElementEcwidProductBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "product" });
}

export function cssStyleElementEcwidProductBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "product" });
}

export function cssStyleElementEcwidProductBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "product" });
}

export function cssStyleElementEcwidProductButtonRightSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "buttonRight",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductFavoritesButtonsDisplay({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const favoritesButtonsDisplay = dvv("favoritesButtonsDisplay");

  return favoritesButtonsDisplay === "off" ? cssStyleDisplayNone() : "";
}

export function cssStyleElementEcwidProductRadioColumns({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const columns = Num.read(dvv("radioColumns")) ?? 1;
  const columnSwitch = dvv("radioColumnSwitch");

  return columnSwitch === "off"
    ? "width:100%;"
    : `width:${100 / columns}%; ${cssStyleDisplayInlineFlex()}`;
}

export function cssStyleElementEcwidProductRadioSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "radio",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductRadioTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "radioTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductRadioColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "radioBgColor" });
}

export function cssStyleElementEcwidProductRadioColorIcon({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColorHex({ v, device, state, store, prefix: "radioBg" });
}

export function cssStyleElementEcwidProductRadioBorderColorIcon({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const color = styleColor({ v, device, state, store, prefix: "radioBgColor" });

  return `border-color:${color};`;
}

export function cssStyleElementEcwidProductRadioIconSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const size = dvv("radioTypographyFontSize");

  return `width:${size}px;height:${size}px;flex: 0 0 ${size}px;`;
}

export function cssStyleElementEcwidProductCheckbox2Columns({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const columns = Num.read(dvv("checkbox2Columns")) ?? 1;
  const columnSwitch = dvv("checkbox2ColumnSwitch");

  return columnSwitch === "off"
    ? "width:100%;"
    : `width:${100 / columns}%; ${cssStyleDisplayInlineFlex()}`;
}

export function cssStyleElementEcwidProductCheckbox2Spacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "checkbox2",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductCheckbox2Typography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "checkbox2Typography",
    renderContext
  });
}

export function cssStyleElementEcwidProductCheckbox2Color({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "checkbox2BgColor" });
}

export function cssStyleElementEcwidProductCheckbox2ColorIcon({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColorHex({ v, device, state, store, prefix: "checkbox2Bg" });
}

export function cssStyleElementEcwidProductCheckbox2BorderColorIcon({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const color = styleColor({
    v,
    device,
    state,
    store,
    prefix: "checkbox2BgColor"
  });

  return `border-color:${color};`;
}

export function cssStyleElementEcwidProductCheckbox2IconSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const size = dvv("checkbox2TypographyFontSize");

  return `width:${size}px;height:${size}px;flex: 0 0 ${size}px;`;
}

export function cssStyleElementEcwidProductTextFieldTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "textFieldTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductTextFieldWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "textField" });
}

export function cssStyleElementEcwidProductTextFieldSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizePaddingSelect({
    v,
    device,
    state,
    store,
    prefix: "textField"
  });
}

export function cssStyleElementEcwidProductTextFieldColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "textFieldColor" });
}

export function cssStyleElementEcwidProductTextFieldColorFocus({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const color = styleColor({
    v,
    device,
    state,
    store,
    prefix: "textFieldColor"
  });

  return `-webkit-text-fill-color:${color} !important;`;
}

export function cssStyleElementEcwidProductTextFieldBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "textFieldBg" });
}

export function cssStyleElementEcwidProductTextFieldBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "textField" });
}

export function cssStyleElementEcwidProductTextFieldBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "textField" });
}

export function cssStyleElementEcwidProductTextFieldBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "textField" });
}

export function cssStyleElementEcwidProductTextFieldBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "textField" });
}

export function cssStyleElementEcwidProductTextFieldAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    prefix: "textField"
  });
}

export function cssStyleElementEcwidProductTextFieldPlaceholder({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const placeholder = dvv("textFieldPlaceholder");

  return placeholder === "off" ? cssStyleDisplayNone() : cssStyleDisplayFlex();
}

export function cssStyleElementEcwidProductTextFieldSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "textField",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductTextFieldPadding({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const size = Num.read(dvv("textFieldTypographyFontSize")) ?? 14;

  return `padding:${size - 5}px 0;`;
}

export function cssStyleElementEcwidProductTextareaTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "textareaTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductTextareaWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaHeight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, store, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizePaddingSelect({
    v,
    device,
    state,
    store,
    prefix: "textarea"
  });
}

export function cssStyleElementEcwidProductTextareaColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "textareaColor" });
}

export function cssStyleElementEcwidProductTextareaBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "textareaBg" });
}

export function cssStyleElementEcwidProductTextareaBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaPlaceholder({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const placeholder = dvv("textareaPlaceholder");

  return placeholder === "off" ? cssStyleDisplayNone() : cssStyleDisplayFlex();
}

export function cssStyleElementEcwidProductTextareaAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    prefix: "textarea"
  });
}

export function cssStyleElementEcwidProductTextareaSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "textarea",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductDatepickerTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "datepickerTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductDatepickerWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "datepicker" });
}

export function cssStyleElementEcwidProductDatepickerSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizePaddingSelect({
    v,
    device,
    state,
    store,
    prefix: "datepicker"
  });
}

export function cssStyleElementEcwidProductDatepickerColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "datepickerColor" });
}

export function cssStyleElementEcwidProductDatepickerBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "datepickerBg" });
}

export function cssStyleElementEcwidProductDatepickerBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "datepicker" });
}

export function cssStyleElementEcwidProductDatepickerBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "datepicker" });
}

export function cssStyleElementEcwidProductDatepickerBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    prefix: "datepicker"
  });
}

export function cssStyleElementEcwidProductDatepickerBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "datepicker" });
}

export function cssStyleElementEcwidProductDatepickerPlaceholder({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const placeholder = dvv("datepickerPlaceholder");

  return placeholder === "off" ? cssStyleDisplayNone() : cssStyleDisplayFlex();
}

export function cssStyleElementEcwidProductDatepickerSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "datepicker",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductDatepickerAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    prefix: "datepicker"
  });
}

export function cssStyleElementEcwidProductDatepickerColorFocus({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const color = styleColor({
    v,
    device,
    state,
    store,
    prefix: "datepickerColor"
  });

  return `-webkit-text-fill-color:${color}!important;`;
}

export function cssStyleElementEcwidProductDatepickerPadding({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const size = Num.read(dvv("datepickerTypographyFontSize")) ?? 14;

  return `padding:${size - 5}px 0;`;
}

export function cssStyleElementEcwidProductSelectTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "selectTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductSelectWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "select" });
}

export function cssStyleElementEcwidProductSelectSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizePaddingSelect({
    v,
    device,
    state,
    store,
    prefix: "select"
  });
}

export function cssStyleElementEcwidProductSelectColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "selectColor" });
}

export function cssStyleElementEcwidProductSelectBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "selectBg" });
}

export function cssStyleElementEcwidProductSelectBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "select" });
}

export function cssStyleElementEcwidProductSelectBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "select" });
}

export function cssStyleElementEcwidProductSelectBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "select" });
}

export function cssStyleElementEcwidProductSelectBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "select" });
}

export function cssStyleElementEcwidProductSelectAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    prefix: "select"
  });
}

export function cssStyleElementEcwidProductSelectPlaceholder({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const placeholder = dvv("selectPlaceholder");

  return placeholder === "off" ? cssStyleDisplayNone() : cssStyleDisplayFlex();
}

export function cssStyleElementEcwidProductSelectSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "select",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductSelectIconSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const size = dvv("selectTypographyFontSize");

  return `width:${size}px; height:${size}px; max-width:${size}px;`;
}

export function cssStyleElementEcwidProductSelectPadding({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const size = Num.read(dvv("selectTypographyFontSize")) ?? 14;

  return `padding:${size - 5}px 0;`;
}

export function cssStyleElementEcwidProductFilesTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "filesTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductFilesSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizePaddingSelect({
    v,
    device,
    state,
    store,
    prefix: "files"
  });
}

export function cssStyleElementEcwidProductFilesWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "files" });
}

export function cssStyleElementEcwidProductFilesColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "filesColor" });
}

export function cssStyleElementEcwidProductFilesBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "filesBg" });
}

export function cssStyleElementEcwidProductFilesBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "files" });
}

export function cssStyleElementEcwidProductFilesBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "files" });
}

export function cssStyleElementEcwidProductFilesBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "files" });
}

export function cssStyleElementEcwidProductFilesBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "files" });
}

export function cssStyleElementEcwidProductFilesAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const textAlign = styleAlignHorizontal({
    v,
    device,
    state,
    store,
    prefix: "files"
  });

  return textAlign ? `text-align:-webkit-${textAlign};` : "";
}

export function cssStyleElementEcwidProductFilesSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "files",
    direction: "bottom"
  });
}

// Style SKU
export function cssStyleElementEcwidProductSKUColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "SKUColor" });
}

export function cssStyleElementEcwidProductSKUTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "SKUTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductSKUAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "SKU" });
}

export function cssStyleElementEcwidProductSKUSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "SKU",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductQtyWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtyHeight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, store, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtyAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "qty"
  });
}

export function cssStyleElementEcwidProductQtyColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "qtyColor" });
}

export function cssStyleElementEcwidProductQtyBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "qtyBg" });
}

export function cssStyleElementEcwidProductQtyBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtyBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtyBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtyBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtySpacingRight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "qty",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductQtySpacingBottom({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "qtyBottom",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductAttributeColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "attributeColor" });
}

export function cssStyleElementEcwidProductAttributeTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "attributeTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductAttributeAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "attribute" });
}

export function cssStyleElementEcwidProductAttributeSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "attribute",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductShowMoreColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "showMoreColor" });
}

export function cssStyleElementEcwidProductShowMoreTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "showMoreTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductShowMoreAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "showMore" });
}

export function cssStyleElementEcwidProductShowMoreSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "showMore",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductWholesaleColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "wholesaleColor" });
}

export function cssStyleElementEcwidProductWholesalePriceColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "wholesalePriceColor"
  });
}

export function cssStyleElementEcwidProductWholesaleTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductWholesalePriceTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "wholesalePriceTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductWholesalePriceAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "wholesalePrice"
  });
}

export function cssStyleElementEcwidProductWholesalePriceSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "wholesalePrice",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductWholesalePriceRightSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "wholesalePriceRight",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductWholesalePriceColumn({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const column = dvv("wholesalePriceColumn");
  const display = cssStyleDisplayInlineBlock();

  return column === "on" ? `${display} width:100%;` : "";
}

export function cssStyleElementEcwidProductWholesaleNoteColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "wholesaleNoteColor"
  });
}

export function cssStyleElementEcwidProductWholesaleNoteTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "wholesaleNoteTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductWholesaleNoteAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "wholesaleNote"
  });
}

export function cssStyleElementEcwidProductWholesaleNoteSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "wholesaleNote",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductSurchargeTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "surchargeTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductSurchargeColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "surchargeColor" });
}

export function cssStyleElementEcwidProductWholesaleTitleColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTitleColor"
  });
}

export function cssStyleElementEcwidProductWholesaleTitleTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductWholesaleTitleAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTitle"
  });
}

export function cssStyleElementEcwidProductWholesaleTitleSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTitle",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductWholesaleTableHeaderColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTableHeaderColor"
  });
}

export function cssStyleElementEcwidProductWholesaleTableHeaderTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTableHeaderTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductWholesaleTableHeaderAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTableHeader"
  });
}

export function cssStyleElementEcwidProductWholesaleTableHeaderSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTableHeader",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductWholesaleTableBodyColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTableBodyColor"
  });
}

export function cssStyleElementEcwidProductWholesaleTableBodyTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTableBodyTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductWholesaleTableBodyAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTableBody"
  });
}

export function cssStyleElementEcwidProductWholesaleTableBodySpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "wholesaleTableBody",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductRelatedTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "relatedTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductRelatedColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "relatedTitleColor"
  });
}

export function cssStyleElementEcwidProductRelatedAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "relatedTitle"
  });
}

export function cssStyleElementEcwidProductRelatedSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "relatedTitle",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridTitleTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "gridTitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductGridTitleColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "gridTitleColor"
  });
}

export function cssStyleElementEcwidProductGridTitleAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "gridTitle"
  });
}

export function cssStyleElementEcwidProductGridTitleSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "gridTitle",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridSubtitleTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "gridSubtitleTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductGridSubtitleColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "gridSubtitleColor"
  });
}

export function cssStyleElementEcwidProductGridSubtitleAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "gridSubtitle"
  });
}

export function cssStyleElementEcwidProductGridSubtitleSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "gridSubtitle",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridSKUInnerTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "gridSKUInnerTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductGridSKUInnerColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "gridSKUInnerColor"
  });
}

export function cssStyleElementEcwidProductGridSKUInnerAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "gridSKUInner"
  });
}

export function cssStyleElementEcwidProductGridSKUInnerSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "gridSKUInner",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridPriceTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "gridPriceTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductGridPriceColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "gridPriceColor"
  });
}

export function cssStyleElementEcwidProductGridPriceAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleFlexColumnHorizontalAlign({
    v,
    device,
    state,
    store,
    prefix: "gridPrice"
  });
}

export function cssStyleElementEcwidProductGridPriceSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "gridPrice",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridBuyNowHight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeMinHeightPx({
    v,
    device,
    state,
    store,
    prefix: "gridBuyNow"
  });
}

export function cssStyleElementEcwidProductGridBuyNowWith({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeMinWidth({
    v,
    device,
    state,
    store,
    prefix: "gridBuyNow"
  });
}

export function cssStyleElementEcwidProductGridBuyNowTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "gridBuyNowTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductGridBuyNowColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "gridBuyNowColor"
  });
}

export function cssStyleElementEcwidProductGridBuyNowBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "gridBuyNowBg" });
}

export function cssStyleElementEcwidProductGridBuyNowBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "gridBuyNow" });
}

export function cssStyleElementEcwidProductGridBuyNowBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "gridBuyNow" });
}

export function cssStyleElementEcwidProductGridBuyNowBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    prefix: "gridBuyNow"
  });
}

export function cssStyleElementEcwidProductGridBuyNowBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "gridBuyNow" });
}

export function cssStyleElementEcwidProductGridBuyNowAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    prefix: "gridBuyNow"
  });
}

export function cssStyleElementEcwidProductGridBuyNowSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "gridBuyNow",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "gridBg" });
}

export function cssStyleElementEcwidProductGridBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "grid" });
}

export function cssStyleElementEcwidProductGridBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "grid" });
}

export function cssStyleElementEcwidProductGridBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "grid" });
}

export function cssStyleElementEcwidProductGridBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "grid" });
}

export function cssStyleElementEcwidProductGridSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacingWithPadding({
    v,
    device,
    state,
    store,
    prefix: "grid",
    direction: "all"
  });
}

export function cssStyleElementEcwidProductArrowColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleFill({ v, device, state, store, prefix: "arrowColor" });
}

export function cssStyleElementEcwidProductArrowBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "arrowBg" });
}

export function cssStyleElementEcwidProductArrowBgGradient({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix: "arrow" });
}

export function cssStyleElementEcwidProductArrowBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix: "arrow" });
}

export function cssStyleElementEcwidProductArrowBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "arrow" });
}

export function cssStyleElementEcwidProductArrowBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "arrow" });
}

export function cssStyleElementEcwidProductArrowHeight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSizeHeight({
    v,
    device,
    state,
    store,
    prefix: "arrow"
  });
}

export function cssStyleElementEcwidProductTaxesColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "taxesColor"
  });
}

export function cssStyleElementEcwidProductTaxesTypography({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "taxesTypography",
    renderContext
  });
}

export function cssStyleElementEcwidProductTaxesAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "taxes" });
}

export function cssStyleElementEcwidProductTaxesSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    prefix: "taxes",
    direction: "bottom"
  });
}
