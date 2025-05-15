import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";

export function style(data: DynamicStylesProps<ElementModel>) {
  const styles = {
    ".brz && form:not(.variations_form), .brz && form.variations_form .variations_button":
      {
        standart: [
          "cssStyleElementWOOAddToCartInputPosition",
          "cssStyleElementWOOAddToCartInputAlign"
        ]
      },
    ".brz && form.cart .quantity": {
      standart: [
        "cssStyleElementWOOAddToCartInputWidth",
        "cssStyleElementWOOAddToCartInputHeight",
        "cssStyleElementWOOAddToCartSpacing"
      ]
    },
    ".brz &&: input[type=number].input-text": {
      standart: [
        "cssStyleElementWOOAddToCartInputFontFamily",
        "cssStyleElementWOOAddToCartInputFontSize",
        "cssStyleElementWOOAddToCartInputLineHeight",
        "cssStyleElementWOOAddToCartInputFontWeight",
        "cssStyleElementWOOAddToCartInputLetterSpacing",
        "cssStyleElementWOOAddToCartInputFontVariation",
        "cssStyleElementWOOAddToCartInputTextTransform",
        "cssStyleElementWOOAddToCartInputRadius"
      ]
    },
    ".brz &&:hover input[type=number].input-text": {
      standart: [
        "cssStyleElementWOOAddToCartInputColor",
        "cssStyleElementWOOAddToCartInputBg",
        "cssStyleElementWOOAddToCartInputBorder",
        "cssStyleElementWOOAddToCartInputBoxShadow"
      ]
    },
    ".brz &&:hover input[type=number].input-text::placeholder": {
      standart: ["cssStyleElementWOOAddToCartInputColor"]
    },
    ".brz && .single_variation": {
      standart: [
        "cssStyleElementWOOAddToCartValueFontFamily",
        "cssStyleElementWOOAddToCartValueFontSize",
        "cssStyleElementWOOAddToCartValueLineHeight",
        "cssStyleElementWOOAddToCartValueFontWeight",
        "cssStyleElementWOOAddToCartValueLetterSpacing",
        "cssStyleElementWOOAddToCartValueFontVariation",
        "cssStyleElementWOOAddToCartValueTextTransform"
      ]
    },
    ".brz &&:hover .single_variation": {
      standart: ["cssStyleElementWOOAddToCartValueColor"]
    },
    ".brz && button[type=submit].single_add_to_cart_button.single_add_to_cart_button":
      {
        standart: [
          "cssStyleElementWOOAddToCartBorderRadius",
          "cssStyleElementWOOAddToCartSize",
          "cssStyleTypography3FontFamily",
          "cssStyleTypography3FontSize",
          "cssStyleTypography3LineHeight",
          "cssStyleTypography3FontWeight",
          "cssStyleTypography3LetterSpacing",
          "cssStyleTypography3FontVariation",
          "cssStyleTypography3TextTransform"
        ]
      },
    ".brz &&:hover button[type=submit].single_add_to_cart_button.single_add_to_cart_button":
      {
        standart: [
          "cssStyleElementWOOAddToCartButtonColor",
          "cssStyleBgColor",
          "cssStyleBgGradient",
          "cssStyleElementWOOAddToCartBorder",
          "cssStyleBoxShadow"
        ]
      },
    ".brz && td label": {
      standart: [
        "cssStyleElementWOOAddToCartLabelFontFamily",
        "cssStyleElementWOOAddToCartLabelFontSize",
        "cssStyleElementWOOAddToCartLabelLineHeight",
        "cssStyleElementWOOAddToCartLabelFontWeight",
        "cssStyleElementWOOAddToCartLabelLetterSpacing",
        "cssStyleElementWOOAddToCartLabelFontVariation",
        "cssStyleElementWOOAddToCartLabelTextTransform"
      ]
    },
    ".brz &&:hover td label": {
      standart: ["cssStyleElementWOOAddToCartLabelColor"]
    },
    ".brz && th label": {
      standart: [
        "cssStyleElementWOOAddToCartLabelFontFamily",
        "cssStyleElementWOOAddToCartLabelFontSize",
        "cssStyleElementWOOAddToCartLabelLineHeight",
        "cssStyleElementWOOAddToCartLabelFontWeight",
        "cssStyleElementWOOAddToCartLabelLetterSpacing",
        "cssStyleElementWOOAddToCartLabelFontVariation",
        "cssStyleElementWOOAddToCartLabelTextTransform"
      ]
    },
    ".brz &&:hover th label": {
      standart: ["cssStyleElementWOOAddToCartLabelColor"]
    },
    ".brz && td.value .reset_variations": {
      standart: [
        "cssStyleElementWOOAddToCartClearFontFamily",
        "cssStyleElementWOOAddToCartClearFontSize",
        "cssStyleElementWOOAddToCartClearLineHeight",
        "cssStyleElementWOOAddToCartClearFontWeight",
        "cssStyleElementWOOAddToCartClearLetterSpacing",
        "cssStyleElementWOOAddToCartClearFontVariation",
        "cssStyleElementWOOAddToCartClearTextTransform"
      ]
    },
    ".brz &&:hover td.value .reset_variations": {
      standart: ["cssStyleElementWOOAddToCartClearColor"]
    },
    ".brz &&:hover table": {
      standart: [
        "cssStyleElementWOOAddToCartTableMargin",
        "cssStyleElementWOOAddToCartTableBoxShadow"
      ]
    },
    ".brz &&:hover .label, .woocommerce-grouped-product-list-item": {
      standart: ["cssStyleElementWOOAddToCartLabelBg"]
    },
    ".brz &&:hover table td": {
      standart: ["cssStyleElementWOOAddToCartTableBorder"]
    },
    ".brz && td.value select": {
      standart: [
        "cssStyleElementWOOAddToCartValueFontFamily",
        "cssStyleElementWOOAddToCartValueFontSize",
        "cssStyleElementWOOAddToCartValueLineHeight",
        "cssStyleElementWOOAddToCartValueFontWeight",
        "cssStyleElementWOOAddToCartValueLetterSpacing",
        "cssStyleElementWOOAddToCartValueFontVariation",
        "cssStyleElementWOOAddToCartValueTextTransform"
      ]
    },
    ".brz &&:hover td.value select": {
      standart: [
        "cssStyleElementWOOAddToCartTableBorder",
        "cssStyleElementWOOAddToCartValueColor"
      ]
    },
    ".brz &&:hover .value": {
      standart: ["cssStyleElementWOOAddToCartTableBg"]
    },
    ".brz && td.woocommerce-grouped-product-list-item__price": {
      standart: [
        "cssStyleElementWOOAddToCartValueFontFamily",
        "cssStyleElementWOOAddToCartValueFontSize",
        "cssStyleElementWOOAddToCartValueLineHeight",
        "cssStyleElementWOOAddToCartValueFontWeight",
        "cssStyleElementWOOAddToCartValueLetterSpacing",
        "cssStyleElementWOOAddToCartValueFontVariation",
        "cssStyleElementWOOAddToCartValueTextTransform"
      ]
    },
    ".brz &&:hover td.woocommerce-grouped-product-list-item__price": {
      standart: ["cssStyleElementWOOAddToCartValueColor"]
    },
    ".brz && td.woocommerce-grouped-product-list-item__price, .brz && td.value select, .brz && table td, .brz && table, .brz && td.value .reset_variations, .brz && th label, .brz && td label, .brz && input[type=number].input-text, .brz && input[type=number].input-text::placeholder, .brz && .single_variation, .brz && button[type=submit].single_add_to_cart_button.single_add_to_cart_button":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
