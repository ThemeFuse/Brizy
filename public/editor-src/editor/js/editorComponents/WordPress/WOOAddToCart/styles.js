import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover form:not(.variations_form)": {
      standart: [
        "cssStyleElementWOOAddToCartInputPosition",
        "cssStyleElementWOOAddToCartInputAlign"
      ]
    },
    ".brz &&:hover form.variations_form .variations_button": {
      standart: [
        "cssStyleElementWOOAddToCartInputPosition",
        "cssStyleElementWOOAddToCartInputAlign"
      ]
    },
    ".brz &&:hover form.cart .quantity": {
      standart: [
        "cssStyleElementWOOAddToCartInputSize",
        "cssStyleElementWOOAddToCartSpacing"
      ]
    },
    ".brz &&:hover input[type=number].input-text": {
      standart: [
        "cssStyleElementWOOAddToCartInputColor",
        "cssStyleElementWOOAddToCartInputFontFamily",
        "cssStyleElementWOOAddToCartInputFontSize",
        "cssStyleElementWOOAddToCartInputLineHeight",
        "cssStyleElementWOOAddToCartInputFontWeight",
        "cssStyleElementWOOAddToCartInputLetterSpacing",
        "cssStyleElementWOOAddToCartInputRadius",
        "cssStyleElementWOOAddToCartInputBg",
        "cssStyleElementWOOAddToCartInputBorder",
        "cssStyleElementWOOAddToCartInputBoxShadow"
      ]
    },
    ".brz &&:hover .woocommerce-grouped-product-list-item__quantity input[type=number].input-text": {
      standart: [
        "cssStyleElementWOOAddToCartTableBorder",
        "cssStyleElementWOOAddToCartTableBg"
      ]
    },
    ".brz &&:hover input[type=number].input-text::placeholder": {
      standart: ["cssStyleElementWOOAddToCartInputColor"]
    },
    ".brz &&:hover .single_variation": {
      standart: [
        "cssStyleElementWOOAddToCartValueColor",
        "cssStyleElementWOOAddToCartValueFontFamily",
        "cssStyleElementWOOAddToCartValueFontSize",
        "cssStyleElementWOOAddToCartValueLineHeight",
        "cssStyleElementWOOAddToCartValueFontWeight",
        "cssStyleElementWOOAddToCartValueLetterSpacing"
      ]
    },
    ".brz &&:hover button[type=submit].single_add_to_cart_button.single_add_to_cart_button": {
      standart: [
        "cssStyleElementWOOAddToCartBorderRadius",
        "cssStyleElementWOOAddToCartButtonColor",
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleElementWOOAddToCartBorder",
        "cssStyleBoxShadow",
        "cssStyleElementWOOAddToCartSize",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing"
      ]
    },
    ".brz &&:hover td label": {
      standart: [
        "cssStyleElementWOOAddToCartLabelColor",
        "cssStyleElementWOOAddToCartLabelFontFamily",
        "cssStyleElementWOOAddToCartLabelFontSize",
        "cssStyleElementWOOAddToCartLabelLineHeight",
        "cssStyleElementWOOAddToCartLabelFontWeight",
        "cssStyleElementWOOAddToCartLabelLetterSpacing"
      ]
    },
    ".brz &&:hover td.value .reset_variations": {
      standart: [
        "cssStyleElementWOOAddToCartClearColor",
        "cssStyleElementWOOAddToCartClearFontFamily",
        "cssStyleElementWOOAddToCartClearFontSize",
        "cssStyleElementWOOAddToCartClearLineHeight",
        "cssStyleElementWOOAddToCartClearFontWeight",
        "cssStyleElementWOOAddToCartClearLetterSpacing"
      ]
    },

    ".brz &&:hover table": {
      standart: [
        "cssStyleElementWOOAddToCartTableMargin",
        "cssStyleElementWOOAddToCartTableBg",
        "cssStyleElementWOOAddToCartTableBoxShadow"
      ]
    },
    ".brz &&:hover table td": {
      standart: ["cssStyleElementWOOAddToCartTableBorder"]
    },
    ".brz &&:hover td.value select": {
      standart: [
        "cssStyleElementWOOAddToCartTableBorder",
        "cssStyleElementWOOAddToCartTableBg",
        "cssStyleElementWOOAddToCartValueColor",
        "cssStyleElementWOOAddToCartValueFontFamily",
        "cssStyleElementWOOAddToCartValueFontSize",
        "cssStyleElementWOOAddToCartValueLineHeight",
        "cssStyleElementWOOAddToCartValueFontWeight",
        "cssStyleElementWOOAddToCartValueLetterSpacing"
      ]
    },
    ".brz &&:hover td.woocommerce-grouped-product-list-item__price": {
      standart: [
        "cssStyleElementWOOAddToCartValueColor",
        "cssStyleElementWOOAddToCartValueFontFamily",
        "cssStyleElementWOOAddToCartValueFontSize",
        "cssStyleElementWOOAddToCartValueLineHeight",
        "cssStyleElementWOOAddToCartValueFontWeight",
        "cssStyleElementWOOAddToCartValueLetterSpacing"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
