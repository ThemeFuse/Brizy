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
import { styleAlignHorizontal, styleColor } from "visual/utils/style2";
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

// Style Breadcrumbs
export function cssStyleElementEcwidProductBreadcrumbsColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "breadcrumbsColor" });
}

export function cssStyleElementEcwidProductBreadcrumbsTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "breadcrumbsTypography"
  });
}

export function cssStyleElementEcwidProductBreadcrumbsSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacingWithPadding({
    v,
    device,
    state,
    prefix: "breadcrumbs",
    direction: "bottom"
  });
}

// Style Price
export function cssStyleElementEcwidProductPriceColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "priceColor" });
}

export function cssStyleElementEcwidProductPriceTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "priceTypography"
  });
}

export function cssStyleElementEcwidProductPriceAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "price" });
}

export function cssStyleElementEcwidProductPriceSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "price",
    direction: "bottom"
  });
}

// Style In Stock
export function cssStyleElementEcwidProductInStockColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "inStockColor" });
}

export function cssStyleElementEcwidProductInStockTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "inStockTypography"
  });
}

export function cssStyleElementEcwidProductInStockAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "inStock" });
}

export function cssStyleElementEcwidProductInStockSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "inStock",
    direction: "bottom"
  });
}

// Style Details
export function cssStyleElementEcwidProductDetailsColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "detailsColor" });
}

export function cssStyleElementEcwidProductDetailsTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "detailsTypography"
  });
}

export function cssStyleElementEcwidProductDetailsAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "details" });
}

export function cssStyleElementEcwidProductDetailsSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "details",
    direction: "bottom"
  });
}

// Style Details
export function cssStyleElementEcwidProductSizeColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "sizeColor" });
}

export function cssStyleElementEcwidProductSizeTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "sizeTypography"
  });
}

export function cssStyleElementEcwidProductSizeAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "size" });
}

export function cssStyleElementEcwidProductSizeSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "size",
    direction: "bottom"
  });
}

// Style Checkbox
export function cssStyleElementEcwidProductCheckboxTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "checkboxTypography"
  });
}

export function cssStyleElementEcwidProductCheckboxSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({ v, device, state, prefix: "checkbox" });
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
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "checkboxColor" });
}

export function cssStyleElementEcwidProductCheckboxBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "checkboxBg" });
}

export function cssStyleElementEcwidProductCheckboxBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxActiveColor({
  v,
  device
}: CSSValue): string {
  return cssStyleColor({ v, device, state: "active", prefix: "checkboxColor" });
}

export function cssStyleElementEcwidProductCheckboxActiveBgColor({
  v,
  device
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state: "active", prefix: "checkboxBg" });
}

export function cssStyleElementEcwidProductCheckboxActiveBgGradient({
  v,
  device
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state: "active", prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxActiveBorder({
  v,
  device
}: CSSValue): string {
  return cssStyleBorder({ v, device, state: "active", prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxActiveBoxShadow({
  v,
  device
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state: "active", prefix: "checkbox" });
}

export function cssStyleElementEcwidProductCheckboxAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "checkbox" });
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
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "shareTitleColor" });
}

export function cssStyleElementEcwidProductShareTitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "shareTitleTypography"
  });
}

export function cssStyleElementEcwidProductShareTitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "shareTitle" });
}

export function cssStyleElementEcwidProductShareTitleSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "shareTitle",
    direction: "bottom"
  });
}

// Style Favorite button
export function cssStyleElementEcwidProductFavoriteTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "favoriteTypography"
  });
}

export function cssStyleElementEcwidProductFavoriteSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "favoriteColor" });
}

export function cssStyleElementEcwidProductFavoriteBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "favoriteBg" });
}

export function cssStyleElementEcwidProductFavoriteBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "favorite" });
}

export function cssStyleElementEcwidProductFavoriteSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "favorite",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductFavoriteButtonSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "favoriteRight",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductFavoriteSpacingRightIcon({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "favoriteRightIcon",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductFavoriteIconSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({
    v,
    device,
    state,
    prefix: "favoriteIcon"
  });
}

// Style Favorited button
export function cssStyleElementEcwidProductFavoritedTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "favoritedTypography"
  });
}

export function cssStyleElementEcwidProductFavoritedSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "favoritedColor" });
}

export function cssStyleElementEcwidProductFavoritedBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "favoritedBg" });
}

export function cssStyleElementEcwidProductFavoritedBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "favorited" });
}

export function cssStyleElementEcwidProductFavoritedSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "favorited",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductFavoritedSpacingRightIcon({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "favoritedRightIcon",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductFavoritedIconSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({
    v,
    device,
    state,
    prefix: "favoritedIcon"
  });
}

export function cssStyleElementEcwidProductFavoritedButtonSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "favoritedRight",
    direction: "right"
  });
}

// Style View Favorites
export function cssStyleElementEcwidProductViewFavoritesTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "viewFavoritesTypography"
  });
}

export function cssStyleElementEcwidProductViewFavoritesSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, prefix: "viewFavorites" });
}

export function cssStyleElementEcwidProductViewFavoritesWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "viewFavorites" });
}

export function cssStyleElementEcwidProductViewFavoritesColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "viewFavoritesColor" });
}

export function cssStyleElementEcwidProductViewFavoritesBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "viewFavoritesBg" });
}

export function cssStyleElementEcwidProductViewFavoritesBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "viewFavorites" });
}

export function cssStyleElementEcwidProductViewFavoritesBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "viewFavorites" });
}

export function cssStyleElementEcwidProductViewFavoritesBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "viewFavorites" });
}

export function cssStyleElementEcwidProductViewFavoritesBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "viewFavorites" });
}

export function cssStyleElementEcwidProductViewFavoritesSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "viewFavorites",
    direction: "bottom"
  });
}

// Style Share Buttons
export function cssStyleElementEcwidProductShareButtonsTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "shareButtonsTypography"
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
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "shareButtons" });
}

export function cssStyleElementEcwidProductShareButtonsColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "shareButtonsColor" });
}

export function cssStyleElementEcwidProductShareButtonsBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "shareButtonsBg" });
}

export function cssStyleElementEcwidProductShareButtonsBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "shareButtons" });
}

export function cssStyleElementEcwidProductShareButtonsBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "shareButtons" });
}

export function cssStyleElementEcwidProductShareButtonsBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "shareButtons" });
}

export function cssStyleElementEcwidProductShareButtonsBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "shareButtons" });
}

export function cssStyleElementEcwidProductShareButtonsAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "shareButtons"
  });
}

export function cssStyleElementEcwidProductShareButtonsSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "shareButtons",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductShareButtonsSpacingRightIcon({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "shareButtonsRightIcon",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductShareButtonsIconSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidthHeight({
    v,
    device,
    state,
    prefix: "shareButtonsIcon"
  });
}

export function cssStyleElementEcwidProductShareButtonsSpacingRight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "shareButtonsRight",
    direction: "right"
  });
}

// Style Image
export function cssStyleElementEcwidProductGalleryBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "gallery" });
}

export function cssStyleElementEcwidProductGalleryBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "gallery" });
}

export function cssStyleElementEcwidProductGalleryBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "gallery" });
}

export function cssStyleElementEcwidProductGalleryWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeSpacingWidth({
    v,
    device,
    state,
    prefix: "galleryWidth"
  });
}

export function cssStyleElementEcwidProductGalleryAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleMarginAlign({
    v,
    device,
    state,
    prefix: "gallery"
  });
}

// Style Thumbnail
export function cssStyleElementEcwidProductThumbnailSpacingRightBottom({
  v,
  device,
  state
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
        prefix: "thumb",
        direction: "bottom"
      });
    case EcwidProductThumb.ImgThumbVertical:
      return cssStyleSpacing({
        v,
        device,
        state,
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
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const thumbStyle = getThumbs(dvv("thumbStyle"));

  return thumbStyle === EcwidProductThumb.ImgFeed
    ? cssStyleSpacing({
        v,
        device,
        state,
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
  state
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
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const thumbStyle = getThumbs(dvv("thumbStyle"));

  return thumbStyle === EcwidProductThumb.ImgFeed
    ? cssStyleSizeSpacingWidth({
        v,
        device,
        state,
        prefix: "thumbnailWidth"
      })
    : "";
}

export function cssStyleElementEcwidProductThumbnailActiveBorder({
  v,
  device
}: CSSValue): string {
  return cssStyleBorder({ v, device, state: ACTIVE, prefix: "thumbnail" });
}

export function cssStyleElementEcwidProductThumbnailActiveBoxShadow({
  v,
  device
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state: ACTIVE, prefix: "thumbnail" });
}

export function cssStyleElementEcwidProductFlagSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "flagLabel",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductFlagLabelColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "flagLabelColor"
  });
}

export function cssStyleElementEcwidProductFlagColorBg({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColorHex({
    v,
    device,
    state,
    prefix: "flagBg"
  });
}

export function cssStyleElementEcwidProductFlagColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "flagBgColor"
  });
}

export function cssStyleElementEcwidProductFlagLabelTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "flagLabelTypography"
  });
}

export function cssStyleElementEcwidProductFlagLabelAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "flagLabel" });
}

// Style Checkout
export function cssStyleElementEcwidProductCheckoutTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "checkoutTypography"
  });
}

export function cssStyleElementEcwidProductCheckoutSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "checkoutColor" });
}

export function cssStyleElementEcwidProductCheckoutBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "checkoutBg" });
}

export function cssStyleElementEcwidProductCheckoutBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "checkout" });
}

export function cssStyleElementEcwidProductCheckoutSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "checkout",
    direction: "bottom"
  });
}

// Style Checkout
export function cssStyleElementEcwidProductAddToBagTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "addToBagTypography"
  });
}

export function cssStyleElementEcwidProductAddToBagSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePadding({ v, device, state, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "addToBagColor" });
}

export function cssStyleElementEcwidProductAddToBagBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "addToBagBg" });
}

export function cssStyleElementEcwidProductAddToBagBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "addToBag" });
}

export function cssStyleElementEcwidProductAddToBagSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
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
  const right = dvv("buttonRightSpacing");
  const rightSuffix = dvv("buttonRightSpacingSuffix");

  return `margin: 0 ${right}${rightSuffix} ${bottom}${bottomSuffix} 0;`;
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
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "productBg" });
}

export function cssStyleElementEcwidProductBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "product" });
}

export function cssStyleElementEcwidProductBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "product" });
}

export function cssStyleElementEcwidProductBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "product" });
}

export function cssStyleElementEcwidProductButtonRightSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
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
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "radio",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductRadioTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "radioTypography"
  });
}

export function cssStyleElementEcwidProductRadioColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "radioBgColor" });
}

export function cssStyleElementEcwidProductRadioColorIcon({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColorHex({ v, device, state, prefix: "radioBg" });
}

export function cssStyleElementEcwidProductRadioBorderColorIcon({
  v,
  device,
  state
}: CSSValue): string {
  const color = styleColor({ v, device, state, prefix: "radioBgColor" });

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
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "checkbox2",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductCheckbox2Typography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "checkbox2Typography"
  });
}

export function cssStyleElementEcwidProductCheckbox2Color({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "checkbox2BgColor" });
}

export function cssStyleElementEcwidProductCheckbox2ColorIcon({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColorHex({ v, device, state, prefix: "checkbox2Bg" });
}

export function cssStyleElementEcwidProductCheckbox2BorderColorIcon({
  v,
  device,
  state
}: CSSValue): string {
  const color = styleColor({ v, device, state, prefix: "checkbox2BgColor" });

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
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "textFieldTypography"
  });
}

export function cssStyleElementEcwidProductTextFieldWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "textField" });
}

export function cssStyleElementEcwidProductTextFieldSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePaddingSelect({ v, device, state, prefix: "textField" });
}

export function cssStyleElementEcwidProductTextFieldColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "textFieldColor" });
}

export function cssStyleElementEcwidProductTextFieldColorFocus({
  v,
  device,
  state
}: CSSValue): string {
  const color = styleColor({ v, device, state, prefix: "textFieldColor" });

  return `-webkit-text-fill-color:${color} !important;`;
}

export function cssStyleElementEcwidProductTextFieldBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "textFieldBg" });
}

export function cssStyleElementEcwidProductTextFieldBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "textField" });
}

export function cssStyleElementEcwidProductTextFieldBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "textField" });
}

export function cssStyleElementEcwidProductTextFieldBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "textField" });
}

export function cssStyleElementEcwidProductTextFieldBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "textField" });
}

export function cssStyleElementEcwidProductTextFieldAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "textField" });
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
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
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
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "textareaTypography"
  });
}

export function cssStyleElementEcwidProductTextareaWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePaddingSelect({ v, device, state, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "textareaColor" });
}

export function cssStyleElementEcwidProductTextareaBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "textareaBg" });
}

export function cssStyleElementEcwidProductTextareaBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "textarea" });
}

export function cssStyleElementEcwidProductTextareaBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "textarea" });
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
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    prefix: "textarea"
  });
}

export function cssStyleElementEcwidProductTextareaSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "textarea",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductDatepickerTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "datepickerTypography"
  });
}

export function cssStyleElementEcwidProductDatepickerWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "datepicker" });
}

export function cssStyleElementEcwidProductDatepickerSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePaddingSelect({ v, device, state, prefix: "datepicker" });
}

export function cssStyleElementEcwidProductDatepickerColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "datepickerColor" });
}

export function cssStyleElementEcwidProductDatepickerBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "datepickerBg" });
}

export function cssStyleElementEcwidProductDatepickerBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "datepicker" });
}

export function cssStyleElementEcwidProductDatepickerBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "datepicker" });
}

export function cssStyleElementEcwidProductDatepickerBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "datepicker" });
}

export function cssStyleElementEcwidProductDatepickerBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "datepicker" });
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
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "datepicker",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductDatepickerAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    prefix: "datepicker"
  });
}

export function cssStyleElementEcwidProductDatepickerColorFocus({
  v,
  device,
  state
}: CSSValue): string {
  const color = styleColor({ v, device, state, prefix: "datepickerColor" });

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
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "selectTypography"
  });
}

export function cssStyleElementEcwidProductSelectWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "select" });
}

export function cssStyleElementEcwidProductSelectSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePaddingSelect({ v, device, state, prefix: "select" });
}

export function cssStyleElementEcwidProductSelectColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "selectColor" });
}

export function cssStyleElementEcwidProductSelectBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "selectBg" });
}

export function cssStyleElementEcwidProductSelectBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "select" });
}

export function cssStyleElementEcwidProductSelectBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "select" });
}

export function cssStyleElementEcwidProductSelectBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "select" });
}

export function cssStyleElementEcwidProductSelectBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "select" });
}

export function cssStyleElementEcwidProductSelectAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({ v, device, state, prefix: "select" });
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
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
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
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "filesTypography"
  });
}

export function cssStyleElementEcwidProductFilesSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizePaddingSelect({ v, device, state, prefix: "files" });
}

export function cssStyleElementEcwidProductFilesWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "files" });
}

export function cssStyleElementEcwidProductFilesColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "filesColor" });
}

export function cssStyleElementEcwidProductFilesBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "filesBg" });
}

export function cssStyleElementEcwidProductFilesBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "files" });
}

export function cssStyleElementEcwidProductFilesBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "files" });
}

export function cssStyleElementEcwidProductFilesBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "files" });
}

export function cssStyleElementEcwidProductFilesBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "files" });
}

export function cssStyleElementEcwidProductFilesAlign({
  v,
  device,
  state
}: CSSValue): string {
  const textAlign = styleAlignHorizontal({ v, device, state, prefix: "files" });

  return textAlign ? `text-align:-webkit-${textAlign};` : "";
}

export function cssStyleElementEcwidProductFilesSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "files",
    direction: "bottom"
  });
}

// Style SKU
export function cssStyleElementEcwidProductSKUColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "SKUColor" });
}

export function cssStyleElementEcwidProductSKUTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "SKUTypography"
  });
}

export function cssStyleElementEcwidProductSKUAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "SKU" });
}

export function cssStyleElementEcwidProductSKUSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "SKU",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductQtyWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtyHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtyAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "qty"
  });
}

export function cssStyleElementEcwidProductQtyColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "qtyColor" });
}

export function cssStyleElementEcwidProductQtyBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "qtyBg" });
}

export function cssStyleElementEcwidProductQtyBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtyBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtyBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtyBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "qty" });
}

export function cssStyleElementEcwidProductQtySpacingRight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "qty",
    direction: "right"
  });
}

export function cssStyleElementEcwidProductQtySpacingBottom({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "qtyBottom",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductAttributeColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "attributeColor" });
}

export function cssStyleElementEcwidProductAttributeTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "attributeTypography"
  });
}

export function cssStyleElementEcwidProductAttributeAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "attribute" });
}

export function cssStyleElementEcwidProductAttributeSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "attribute",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductShowMoreColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "showMoreColor" });
}

export function cssStyleElementEcwidProductShowMoreTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "showMoreTypography"
  });
}

export function cssStyleElementEcwidProductShowMoreAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "showMore" });
}

export function cssStyleElementEcwidProductShowMoreSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "showMore",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductWholesaleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "wholesaleColor" });
}

export function cssStyleElementEcwidProductWholesalePriceColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "wholesalePriceColor" });
}

export function cssStyleElementEcwidProductWholesaleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "wholesaleTypography"
  });
}

export function cssStyleElementEcwidProductWholesalePriceTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "wholesalePriceTypography"
  });
}

export function cssStyleElementEcwidProductWholesalePriceAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "wholesalePrice" });
}

export function cssStyleElementEcwidProductWholesalePriceSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "wholesalePrice",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductWholesalePriceRightSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
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
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "wholesaleNoteColor" });
}

export function cssStyleElementEcwidProductWholesaleNoteTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "wholesaleNoteTypography"
  });
}

export function cssStyleElementEcwidProductWholesaleNoteAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "wholesaleNote" });
}

export function cssStyleElementEcwidProductWholesaleNoteSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "wholesaleNote",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductSurchargeTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "surchargeTypography"
  });
}

export function cssStyleElementEcwidProductSurchargeColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "surchargeColor" });
}

export function cssStyleElementEcwidProductWholesaleTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "wholesaleTitleColor" });
}

export function cssStyleElementEcwidProductWholesaleTitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "wholesaleTitleTypography"
  });
}

export function cssStyleElementEcwidProductWholesaleTitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "wholesaleTitle" });
}

export function cssStyleElementEcwidProductWholesaleTitleSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "wholesaleTitle",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductWholesaleTableHeaderColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "wholesaleTableHeaderColor"
  });
}

export function cssStyleElementEcwidProductWholesaleTableHeaderTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "wholesaleTableHeaderTypography"
  });
}

export function cssStyleElementEcwidProductWholesaleTableHeaderAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "wholesaleTableHeader"
  });
}

export function cssStyleElementEcwidProductWholesaleTableHeaderSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "wholesaleTableHeader",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductWholesaleTableBodyColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "wholesaleTableBodyColor"
  });
}

export function cssStyleElementEcwidProductWholesaleTableBodyTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "wholesaleTableBodyTypography"
  });
}

export function cssStyleElementEcwidProductWholesaleTableBodyAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "wholesaleTableBody"
  });
}

export function cssStyleElementEcwidProductWholesaleTableBodySpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "wholesaleTableBody",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductRelatedTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "relatedTitleTypography"
  });
}

export function cssStyleElementEcwidProductRelatedColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "relatedTitleColor"
  });
}

export function cssStyleElementEcwidProductRelatedAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "relatedTitle"
  });
}

export function cssStyleElementEcwidProductRelatedSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "relatedTitle",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridTitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "gridTitleTypography"
  });
}

export function cssStyleElementEcwidProductGridTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "gridTitleColor"
  });
}

export function cssStyleElementEcwidProductGridTitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "gridTitle"
  });
}

export function cssStyleElementEcwidProductGridTitleSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "gridTitle",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridSubtitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "gridSubtitleTypography"
  });
}

export function cssStyleElementEcwidProductGridSubtitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "gridSubtitleColor"
  });
}

export function cssStyleElementEcwidProductGridSubtitleAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "gridSubtitle"
  });
}

export function cssStyleElementEcwidProductGridSubtitleSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "gridSubtitle",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridSKUInnerTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "gridSKUInnerTypography"
  });
}

export function cssStyleElementEcwidProductGridSKUInnerColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "gridSKUInnerColor"
  });
}

export function cssStyleElementEcwidProductGridSKUInnerAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "gridSKUInner"
  });
}

export function cssStyleElementEcwidProductGridSKUInnerSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "gridSKUInner",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridPriceTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "gridPriceTypography"
  });
}

export function cssStyleElementEcwidProductGridPriceColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "gridPriceColor"
  });
}

export function cssStyleElementEcwidProductGridPriceAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexColumnHorizontalAlign({
    v,
    device,
    state,
    prefix: "gridPrice"
  });
}

export function cssStyleElementEcwidProductGridPriceSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "gridPrice",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridBuyNowHight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeMinHeightPx({
    v,
    device,
    state,
    prefix: "gridBuyNow"
  });
}

export function cssStyleElementEcwidProductGridBuyNowWith({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeMinWidth({
    v,
    device,
    state,
    prefix: "gridBuyNow"
  });
}

export function cssStyleElementEcwidProductGridBuyNowTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "gridBuyNowTypography"
  });
}

export function cssStyleElementEcwidProductGridBuyNowColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "gridBuyNowColor"
  });
}

export function cssStyleElementEcwidProductGridBuyNowBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "gridBuyNowBg" });
}

export function cssStyleElementEcwidProductGridBuyNowBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "gridBuyNow" });
}

export function cssStyleElementEcwidProductGridBuyNowBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "gridBuyNow" });
}

export function cssStyleElementEcwidProductGridBuyNowBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "gridBuyNow" });
}

export function cssStyleElementEcwidProductGridBuyNowBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "gridBuyNow" });
}

export function cssStyleElementEcwidProductGridBuyNowAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({
    v,
    device,
    state,
    prefix: "gridBuyNow"
  });
}

export function cssStyleElementEcwidProductGridBuyNowSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "gridBuyNow",
    direction: "bottom"
  });
}

export function cssStyleElementEcwidProductGridBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "gridBg" });
}

export function cssStyleElementEcwidProductGridBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "grid" });
}

export function cssStyleElementEcwidProductGridBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "grid" });
}

export function cssStyleElementEcwidProductGridBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "grid" });
}

export function cssStyleElementEcwidProductGridBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "grid" });
}

export function cssStyleElementEcwidProductGridSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacingWithPadding({
    v,
    device,
    state,
    prefix: "grid",
    direction: "all"
  });
}

export function cssStyleElementEcwidProductArrowColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFill({ v, device, state, prefix: "arrowColor" });
}

export function cssStyleElementEcwidProductArrowBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "arrowBg" });
}

export function cssStyleElementEcwidProductArrowBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "arrow" });
}

export function cssStyleElementEcwidProductArrowBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix: "arrow" });
}

export function cssStyleElementEcwidProductArrowBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix: "arrow" });
}

export function cssStyleElementEcwidProductArrowBoxShadow({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix: "arrow" });
}

export function cssStyleElementEcwidProductArrowHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeHeight({
    v,
    device,
    state,
    prefix: "arrow"
  });
}

export function cssStyleElementEcwidProductTaxesColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "taxesColor"
  });
}

export function cssStyleElementEcwidProductTaxesTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "taxesTypography"
  });
}

export function cssStyleElementEcwidProductTaxesAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, prefix: "taxes" });
}

export function cssStyleElementEcwidProductTaxesSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "taxes",
    direction: "bottom"
  });
}
