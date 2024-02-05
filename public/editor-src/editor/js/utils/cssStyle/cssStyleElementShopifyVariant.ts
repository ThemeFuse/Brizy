import {
  Orientation,
  VariantStyle
} from "@brizy/widget/src/Shopify/Variant/types";
import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";
import { cssStyleColor } from "visual/utils/cssStyle/cssStyleColor";
import { cssStyleMargin } from "visual/utils/cssStyle/cssStyleMargin";
import {
  cssStyleSizeHeight,
  cssStyleSizeWidth
} from "visual/utils/cssStyle/cssStyleSize";
import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight,
  getAllCssStyleTypography
} from "visual/utils/cssStyle/cssStyleTypography2";
import { CSSValue } from "visual/utils/style2/types";
import { MValue } from "../value";
import { cssStyleFlexHorizontalAlign } from "./cssStyleAlign";
import { cssStyleBgGradient } from "./cssStyleBgGradient";
import { cssStyleSpacing } from "./cssStyleSpacing";

const getLabelSpacingDirection = (
  style: VariantStyle,
  orientation: Orientation
): MValue<"bottom" | "right"> => {
  switch (style) {
    case VariantStyle.Select: {
      if (orientation === "row" || orientation === "column2") {
        return "bottom";
      }
      if (orientation === "column") {
        return "right";
      }
      break;
    }
    case VariantStyle.Radio: {
      if (orientation === "row") {
        return "right";
      }
      if (orientation === "column") {
        return "bottom";
      }
      break;
    }
  }
};

export function cssStyleElementShopifyVariantColorLabel({
  v,
  device,
  state,
  prefix = "labelColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantFontFamilyLabel({
  v,
  device,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix });
}

export function cssStyleElementShopifyVariantFontSizeLabel({
  v,
  device,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix });
}

export function cssStyleElementShopifyVariantFontWeightLabel({
  v,
  device,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix });
}

export function cssStyleElementShopifyVariantLetterSpacingLabel({
  v,
  device,
  state,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix
  });
}

export function cssStyleElementShopifyVariantLineHeightLabel({
  v,
  device,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    prefix
  });
}

export function cssStyleElementShopifyVariantFontVariationLabel({
  v,
  device,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    prefix
  });
}

export function cssStyleElementShopifyVariantAlignLabel({
  v,
  device,
  state,
  prefix = "label"
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    state,
    device,
    prefix
  });
}

export function cssStyleElementShopifyVariantBgRadio({
  v,
  device,
  state,
  prefix = "bgRadio"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBgRadioActive({
  v,
  device,
  prefix = "bgRadio"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state: "active", prefix });
}

export function cssStyleElementShopifyVariantColorRadio({
  v,
  device,
  state,
  prefix = "radioColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantColorRadioActive({
  v,
  device,
  prefix = "radioColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state: "active", prefix });
}

export function cssStyleElementShopifyVariantBorderRadio({
  v,
  device,
  state,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBorderRadioActive({
  v,
  device,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state: "active", prefix });
}

export function cssStyleElementShopifyVariantBoxShadowRadio({
  v,
  device,
  state,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowRadioActive({
  v,
  device,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state: "active", prefix });
}
export function cssStyleElementShopifyVariantFontFamilyRadio({
  v,
  device,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix });
}

export function cssStyleElementShopifyVariantFontSizeRadio({
  v,
  device,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix });
}

export function cssStyleElementShopifyVariantFontWeightRadio({
  v,
  device,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix });
}

export function cssStyleElementShopifyVariantLetterSpacingRadio({
  v,
  device,
  state,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix
  });
}

export function cssStyleElementShopifyVariantFontVariationRadio({
  v,
  device,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    prefix
  });
}

export function cssStyleElementShopifyVariantLineHeightRadio({
  v,
  device,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    prefix
  });
}

export function cssStyleElementShopifyVariantBorderRadiusRadio({
  v,
  device,
  state,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    prefix
  });
}

export function cssStyleElementShopifyVariantMarginRadio({
  v,
  device,
  state,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantSelectWidth({
  v,
  device,
  state,
  prefix = "select"
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix });
}
export function cssStyleElementShopifyVariantSelectHeight({
  v,
  device,
  state,
  prefix = "select"
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBgSelectedItem({
  v,
  device,
  state,
  prefix = "bgSelectedItem"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantColorSelectedItem({
  v,
  device,
  state,
  prefix = "selectedItemColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBorderSelectedItem({
  v,
  device,
  state,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowSelectedItem({
  v,
  device,
  state,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantFontFamilySelectedItem({
  v,
  device,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix });
}

export function cssStyleElementShopifyVariantFontSizeSelectedItem({
  v,
  device,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix });
}

export function cssStyleElementShopifyVariantFontWeightSelectedItem({
  v,
  device,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix });
}

export function cssStyleElementShopifyVariantLetterSpacingSelectedItem({
  v,
  device,
  state,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix
  });
}

export function cssStyleElementShopifyVariantLineHeightSelectedItem({
  v,
  device,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    prefix
  });
}

export function cssStyleElementShopifyVariantFontVariationSelectedItem({
  v,
  device,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    prefix
  });
}

export function cssStyleElementShopifyVariantBgDropdown({
  v,
  device,
  state,
  prefix = "bgDropdown"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantColorDropdown({
  v,
  device,
  state,
  prefix = "dropdownColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBorderDropdown({
  v,
  device,
  state,
  prefix = "dropdown"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowDropdown({
  v,
  device,
  state,
  prefix = "dropdown"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBgImageBlock({
  v,
  device,
  state,
  prefix = "imageBlockBg"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBgImageBlockActive({
  v,
  device,
  prefix = "imageBlockBg"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state: "active", prefix });
}

export function cssStyleElementShopifyVariantBoxShadowImageBlock({
  v,
  device,
  state,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowImageBlockActive({
  v,
  device,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state: "active", prefix });
}

export function cssStyleElementShopifyVariantBorderImageBlock({
  v,
  device,
  state,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBorderImageBlockActive({
  v,
  device,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state: "active", prefix });
}

export function cssStyleElementShopifyVariantGradientImageBlock({
  v,
  device,
  state,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantImageBlockWidth({
  v,
  device,
  state,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantImageBlockHeight({
  v,
  device,
  state,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantRadioWidth({
  v,
  device,
  state,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, prefix });
}
export function cssStyleElementShopifyVariantRadioHeight({
  v,
  device,
  state,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantBorderRadiusImageBlock({
  v,
  device,
  state,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    prefix
  });
}

export function cssStyleElementShopifyVariantMarginImage({
  v,
  device,
  state,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementShopifyVariantSelectBorderRadius({
  v,
  device,
  state,
  prefix = "select"
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    prefix
  });
}

export const cssStyleElementShopifyVariantSelectSpacing = ({
  v,
  device,
  state
}: CSSValue): string => {
  const { orientation } = v;

  const direction = orientation === "row" ? "right" : "bottom";

  return cssStyleSpacing({
    v,
    device,
    state,
    direction,
    prefix: "select"
  });
};

export const cssStyleElementShopifyVariantRadioSpacing = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleSpacing({
    v,
    device,
    state,
    direction: "right",
    prefix: "radio"
  });
};

export const cssStyleElementShopifyVariantRadioRowSpacing = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleSpacing({
    v,
    device,
    state,
    direction: "bottom",
    prefix: "radioRow"
  });
};

export const cssStyleElementShopifyVariantLabelSpacing = ({
  v,
  device,
  state
}: CSSValue): string => {
  const { variantStyle, orientation } = v;

  const direction = getLabelSpacingDirection(
    variantStyle as VariantStyle,
    orientation as Orientation
  );

  if (direction) {
    return cssStyleSpacing({
      v,
      device,
      state,
      direction,
      prefix: "label"
    });
  }

  return "";
};

export const cssStyleElementShopifyVariantDropdownTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({ v, device, state, prefix: "dropdown" });
};

export const cssStyleElementShopifyVariantLabelWidth = ({
  v,
  device,
  state
}: CSSValue): string =>
  cssStyleSizeWidth({ v, device, state, prefix: "label" });
