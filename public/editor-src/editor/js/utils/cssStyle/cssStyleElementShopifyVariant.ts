import {
  Orientation,
  VariantStyle
} from "@brizy/widget/src/Shopify/Variant/types";
import { WithRenderContext } from "visual/providers/RenderProvider";
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
import { cssStyleTextTransforms } from "visual/utils/cssStyle/cssStyleTextTransform";
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
  store,
  prefix = "labelColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantFontFamilyLabel({
  v,
  device,
  store,
  prefix = "label",
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix,
    renderContext
  });
}

export function cssStyleElementShopifyVariantFontSizeLabel({
  v,
  device,
  store,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix });
}

export function cssStyleElementShopifyVariantFontWeightLabel({
  v,
  device,
  store,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix });
}

export function cssStyleElementShopifyVariantLetterSpacingLabel({
  v,
  device,
  state,
  store,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantLineHeightLabel({
  v,
  device,
  store,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantFontVariationLabel({
  v,
  device,
  store,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantTextTransformLabel({
  v,
  device,
  state,
  store,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantAlignLabel({
  v,
  device,
  state,
  store,
  prefix = "label"
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    state,
    device,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantBgRadio({
  v,
  device,
  state,
  store,
  prefix = "bgRadio"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantBgRadioActive({
  v,
  device,
  store,
  prefix = "bgRadio"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state: "active", store, prefix });
}

export function cssStyleElementShopifyVariantColorRadio({
  v,
  device,
  state,
  store,
  prefix = "radioColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantColorRadioActive({
  v,
  device,
  store,
  prefix = "radioColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state: "active", store, prefix });
}

export function cssStyleElementShopifyVariantBorderRadio({
  v,
  device,
  state,
  store,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantBorderRadioActive({
  v,
  device,
  store,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state: "active", store, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowRadio({
  v,
  device,
  state,
  store,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowRadioActive({
  v,
  device,
  store,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state: "active", store, prefix });
}
export function cssStyleElementShopifyVariantFontFamilyRadio({
  v,
  device,
  store,
  prefix = "radioValue",
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix,
    renderContext
  });
}

export function cssStyleElementShopifyVariantFontSizeRadio({
  v,
  device,
  store,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix });
}

export function cssStyleElementShopifyVariantFontWeightRadio({
  v,
  device,
  store,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix });
}

export function cssStyleElementShopifyVariantLetterSpacingRadio({
  v,
  device,
  state,
  store,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantFontVariationRadio({
  v,
  device,
  store,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantTextTransformRadio({
  v,
  device,
  state,
  store,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantLineHeightRadio({
  v,
  device,
  store,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantBorderRadiusRadio({
  v,
  device,
  state,
  store,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
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
  store,
  prefix = "select"
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix });
}
export function cssStyleElementShopifyVariantSelectHeight({
  v,
  device,
  state,
  store,
  prefix = "select"
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantBgSelectedItem({
  v,
  device,
  state,
  store,
  prefix = "bgSelectedItem"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantColorSelectedItem({
  v,
  device,
  state,
  store,
  prefix = "selectedItemColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantBorderSelectedItem({
  v,
  device,
  state,
  store,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowSelectedItem({
  v,
  device,
  state,
  store,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantFontFamilySelectedItem({
  v,
  device,
  store,
  prefix = "selectedItem",
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix,
    renderContext
  });
}

export function cssStyleElementShopifyVariantFontSizeSelectedItem({
  v,
  device,
  store,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix });
}

export function cssStyleElementShopifyVariantFontWeightSelectedItem({
  v,
  device,
  store,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix });
}

export function cssStyleElementShopifyVariantLetterSpacingSelectedItem({
  v,
  device,
  state,
  store,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantLineHeightSelectedItem({
  v,
  device,
  store,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantFontVariationSelectedItem({
  v,
  device,
  store,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantTextTransformSelectedItem({
  v,
  device,
  state,
  store,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    prefix
  });
}

export function cssStyleElementShopifyVariantBgDropdown({
  v,
  device,
  state,
  store,
  prefix = "bgDropdown"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantColorDropdown({
  v,
  device,
  state,
  store,
  prefix = "dropdownColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantBorderDropdown({
  v,
  device,
  state,
  store,
  prefix = "dropdown"
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowDropdown({
  v,
  device,
  state,
  store,
  prefix = "dropdown"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantBgImageBlock({
  v,
  device,
  state,
  store,
  prefix = "imageBlockBg"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantBgImageBlockActive({
  v,
  device,
  store,
  prefix = "imageBlockBg"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state: "active", store, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowImageBlock({
  v,
  device,
  state,
  store,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowImageBlockActive({
  v,
  device,
  store,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state: "active", store, prefix });
}

export function cssStyleElementShopifyVariantBorderImageBlock({
  v,
  device,
  state,
  store,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state, prefix });
}

export function cssStyleElementShopifyVariantBorderImageBlockActive({
  v,
  device,
  store,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state: "active", prefix });
}

export function cssStyleElementShopifyVariantGradientImageBlock({
  v,
  device,
  state,
  store,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantImageBlockWidth({
  v,
  device,
  state,
  store,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantImageBlockHeight({
  v,
  device,
  state,
  store,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantRadioWidth({
  v,
  device,
  state,
  store,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, prefix });
}
export function cssStyleElementShopifyVariantRadioHeight({
  v,
  device,
  state,
  store,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, store, prefix });
}

export function cssStyleElementShopifyVariantBorderRadiusImageBlock({
  v,
  device,
  state,
  store,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
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
  store,
  prefix = "select"
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    prefix
  });
}

export const cssStyleElementShopifyVariantSelectSpacing = ({
  v,
  device,
  state,
  store
}: CSSValue): string => {
  const { orientation } = v;

  const direction = orientation === "row" ? "right" : "bottom";

  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    direction,
    prefix: "select"
  });
};

export const cssStyleElementShopifyVariantRadioSpacing = ({
  v,
  device,
  state,
  store
}: CSSValue): string => {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    direction: "right",
    prefix: "radio"
  });
};

export const cssStyleElementShopifyVariantRadioRowSpacing = ({
  v,
  device,
  state,
  store
}: CSSValue): string => {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    direction: "bottom",
    prefix: "radioRow"
  });
};

export const cssStyleElementShopifyVariantLabelSpacing = ({
  v,
  device,
  state,
  store
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
      store,
      direction,
      prefix: "label"
    });
  }

  return "";
};

export const cssStyleElementShopifyVariantDropdownTypography = ({
  v,
  device,
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    prefix: "dropdown",
    renderContext
  });
};

export const cssStyleElementShopifyVariantLabelWidth = ({
  v,
  device,
  state,
  store
}: CSSValue): string =>
  cssStyleSizeWidth({ v, device, state, store, prefix: "label" });
