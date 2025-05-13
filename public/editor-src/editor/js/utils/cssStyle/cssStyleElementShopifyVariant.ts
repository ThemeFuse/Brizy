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
  cssStyleSizeMinHeightPx,
  cssStyleSizeMinWidth,
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
  getConfig,
  prefix = "labelColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantFontFamilyLabel({
  v,
  device,
  store,
  getConfig,
  prefix = "label",
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix,
    renderContext
  });
}

export function cssStyleElementShopifyVariantFontSizeLabel({
  v,
  device,
  store,
  getConfig,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantFontWeightLabel({
  v,
  device,
  store,
  getConfig,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantLetterSpacingLabel({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantLineHeightLabel({
  v,
  device,
  store,
  getConfig,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantFontVariationLabel({
  v,
  device,
  store,
  getConfig,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantTextTransformLabel({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "label"
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantAlignLabel({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "label"
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    state,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantBgRadio({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "bgRadio"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantBgRadioActive({
  v,
  device,
  store,
  getConfig,
  prefix = "bgRadio"
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state: "active",
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantColorRadio({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "radioColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantColorRadioActive({
  v,
  device,
  store,
  getConfig,
  prefix = "radioColor"
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state: "active",
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantBorderRadio({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantBorderRadioActive({
  v,
  device,
  store,
  getConfig,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state: "active",
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantBoxShadowRadio({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowRadioActive({
  v,
  device,
  store,
  getConfig,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state: "active",
    store,
    getConfig,
    prefix
  });
}
export function cssStyleElementShopifyVariantFontFamilyRadio({
  v,
  device,
  store,
  getConfig,
  prefix = "radioValue",
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix,
    renderContext
  });
}

export function cssStyleElementShopifyVariantFontSizeRadio({
  v,
  device,
  store,
  getConfig,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantFontWeightRadio({
  v,
  device,
  store,
  getConfig,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantLetterSpacingRadio({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantFontVariationRadio({
  v,
  device,
  store,
  getConfig,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantTextTransformRadio({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantLineHeightRadio({
  v,
  device,
  store,
  getConfig,
  prefix = "radioValue"
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantBorderRadiusRadio({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    getConfig,
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
  getConfig,
  prefix = "select"
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, getConfig, prefix });
}
export function cssStyleElementShopifyVariantSelectHeight({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "select"
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantBgSelectedItem({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "bgSelectedItem"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantColorSelectedItem({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "selectedItemColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantBorderSelectedItem({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowSelectedItem({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantFontFamilySelectedItem({
  v,
  device,
  store,
  getConfig,
  prefix = "selectedItem",
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix,
    renderContext
  });
}

export function cssStyleElementShopifyVariantFontSizeSelectedItem({
  v,
  device,
  store,
  getConfig,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantFontWeightSelectedItem({
  v,
  device,
  store,
  getConfig,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantLetterSpacingSelectedItem({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantLineHeightSelectedItem({
  v,
  device,
  store,
  getConfig,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantFontVariationSelectedItem({
  v,
  device,
  store,
  getConfig,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantTextTransformSelectedItem({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "selectedItem"
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantBgDropdown({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "bgDropdown"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantColorDropdown({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "dropdownColor"
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantBorderDropdown({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "dropdown"
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowDropdown({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "dropdown"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantBgImageBlock({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "imageBlockBg"
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantBgImageBlockActive({
  v,
  device,
  store,
  getConfig,
  prefix = "imageBlockBg"
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state: "active",
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantBoxShadowImageBlock({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantBoxShadowImageBlockActive({
  v,
  device,
  store,
  getConfig,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBoxShadow({
    v,
    device,
    state: "active",
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantBorderImageBlock({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, getConfig, state, prefix });
}

export function cssStyleElementShopifyVariantBorderImageBlockActive({
  v,
  device,
  store,
  getConfig,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    store,
    getConfig,
    state: "active",
    prefix
  });
}

export function cssStyleElementShopifyVariantGradientImageBlock({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantImageBlockWidth({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleSizeWidth({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantImageBlockHeight({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleSizeHeight({ v, device, state, store, getConfig, prefix });
}

export function cssStyleElementShopifyVariantRadioWidth({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleSizeMinWidth({ v, device, state, store, getConfig, prefix });
}
export function cssStyleElementShopifyVariantRadioHeight({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "radio"
}: CSSValue): string {
  return cssStyleSizeMinHeightPx({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
}

export function cssStyleElementShopifyVariantBorderRadiusImageBlock({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = "imageBlock"
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    getConfig,
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
  getConfig,
  prefix = "select"
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
}

export const cssStyleElementShopifyVariantSelectSpacing = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  const { orientation } = v;

  const direction = orientation === "row" ? "right" : "bottom";

  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    direction,
    prefix: "select"
  });
};

export const cssStyleElementShopifyVariantRadioSpacing = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    direction: "right",
    prefix: "radio"
  });
};

export const cssStyleElementShopifyVariantRadioRowSpacing = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  return cssStyleSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    direction: "bottom",
    prefix: "radioRow"
  });
};

export const cssStyleElementShopifyVariantLabelSpacing = ({
  v,
  device,
  state,
  getConfig,
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
      getConfig,
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
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "dropdown",
    renderContext
  });
};

export const cssStyleElementShopifyVariantLabelWidth = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string =>
  cssStyleSizeMinWidth({ v, device, state, store, getConfig, prefix: "label" });
