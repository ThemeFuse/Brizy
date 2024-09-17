import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";
import { cssStyleColor } from "visual/utils/cssStyle/cssStyleColor";
import { cssStyleMargin } from "visual/utils/cssStyle/cssStyleMargin";
import { cssStylePaddingFourFields } from "visual/utils/cssStyle/cssStylePadding";
import {
  cssStyleSizeMinHeightImportant,
  cssStyleSizeMinWidth
} from "visual/utils/cssStyle/cssStyleSize";
import { cssStyleTextTransforms } from "visual/utils/cssStyle/cssStyleTextTransform";
import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle/cssStyleTypography2";
import { defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/reader/number";
import { CSSValue } from "../style2/types";

export function cssStyleElementShopifyBgColorPrice({
  v,
  device,
  state,
  prefix = "bgPrice"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyBgColorThroughPrice({
  v,
  device,
  state,
  prefix = "bgThroughPrice"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyTextColorPrice({
  v,
  device,
  state,
  prefix = "textColorPrice"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyTextColorThroughPrice({
  v,
  device,
  state,
  prefix = "textColorThroughPrice"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyBorderColorPrice({
  v,
  device,
  state,
  prefix = "price"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix });
}

export function cssStyleElementShopifyBorderColorThroughPrice({
  v,
  device,
  state,
  prefix = "throughPrice"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix });
}
export function cssStyleElementShopifyBoxShadowPrice({
  v,
  device,
  state,
  prefix = "priceS"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix });
}
export function cssStyleElementShopifyBoxShadowThroughPrice({
  v,
  device,
  state,
  prefix = "priceThroughS"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix });
}

export function cssStyleElementShopifyFontFamilyPrice({
  v,
  device,
  prefix = "typographyPrice"
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix });
}
export function cssStyleElementShopifyFontSizePrice({
  v,
  device,
  prefix = "typographyPrice"
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix });
}
export function cssStyleElementShopifyLineHeightPrice({
  v,
  device,
  prefix = "typographyPrice"
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix });
}
export function cssStyleElementShopifyFontWeightPrice({
  v,
  device,
  prefix = "typographyPrice"
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix });
}
export function cssStyleElementShopifyLetterSpacingPrice({
  v,
  device,
  state,
  prefix = "typographyPrice"
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix });
}

export function cssStyleElementShopifyFontVariationPrice({
  v,
  device,
  prefix = "typographyPrice"
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix });
}

export function cssStyleElementShopifyTextTransformPrice({
  v,
  device,
  state,
  prefix = "typographyPrice"
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, prefix, state });
}

export function cssStyleElementShopifyFontFamilyThroughPrice({
  v,
  device,
  prefix = "typographyThroughPrice"
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix });
}
export function cssStyleElementShopifyFontSizeThroughPrice({
  v,
  device,
  prefix = "typographyThroughPrice"
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix });
}
export function cssStyleElementShopifyLineHeightThroughPrice({
  v,
  device,
  prefix = "typographyThroughPrice"
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix });
}

export function cssStyleElementShopifyFontVariationThroughPrice({
  v,
  device,
  prefix = "typographyThroughPrice"
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix });
}

export function cssStyleElementShopifyTextTransformThroughPrice({
  v,
  device,
  state,
  prefix = "typographyThroughPrice"
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, prefix, state });
}

export function cssStyleElementShopifyPaddingFourFieldsPrice({
  v,
  device,
  state,
  prefix = "price"
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, state, device, prefix });
}

export function cssStyleElementShopifyPaddingFourFieldsThroughPrice({
  v,
  device,
  state,
  prefix = "throughPrice"
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, state, device, prefix });
}

export function cssStyleElementShopifyMarginFourFieldsPrice({
  v,
  device,
  state,
  prefix = "price"
}: CSSValue): string {
  return cssStyleMargin({ v, state, device, prefix });
}

export function cssStyleElementShopifyMarginFourFieldsThroughPrice({
  v,
  device,
  state,
  prefix = "throughPrice"
}: CSSValue): string {
  return cssStyleMargin({ v, state, device, prefix });
}
export function cssStyleElementShopifyFontWeightThroughPrice({
  v,
  device,
  prefix = "typographyThroughPrice"
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix });
}
export function cssStyleElementShopifyLetterSpacingThroughPrice({
  v,
  device,
  state,
  prefix = "typographyThroughPrice"
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix });
}

export function cssStyleElementShopifyPriceHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeMinHeightImportant({ v, device, state, prefix: "price" });
}

export function cssStyleElementShopifyPriceWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeMinWidth({ v, device, state, prefix: "price" });
}

export function cssStyleElementShopifyPriceThroughHeight({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeMinHeightImportant({
    v,
    device,
    state,
    prefix: "thoughPrice"
  });
}

export function cssStyleElementShopifyPriceThroughWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeMinWidth({ v, device, state, prefix: "thoughPrice" });
}

export function cssStyleElementShopifyPriceSpacingStyle1({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const spacing = Num.read(dvv("spacing"));
  const style = dvv("priceStyle");

  if (style === "style-1" && spacing) {
    return `margin-right:${spacing}px;`;
  }
  return "";
}

export function cssStyleElementShopifyPriceRadius({
  v,
  device,
  state,
  prefix = "price"
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix });
}

export function cssStyleElementShopifyPriceThroughRadius({
  v,
  device,
  state,
  prefix = "priceThrough"
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, prefix });
}
