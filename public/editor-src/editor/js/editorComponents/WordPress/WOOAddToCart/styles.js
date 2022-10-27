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
    ".brz && form.cart .quantity:hover": {
      standart: [
        "cssStyleElementWOOAddToCartInputWidth",
        "cssStyleElementWOOAddToCartInputHeight",
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
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover input[type=number].input-text::placeholder": {
      standart: ["cssStyleElementWOOAddToCartInputColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .single_variation": {
      standart: [
        "cssStyleElementWOOAddToCartValueColor",
        "cssStyleElementWOOAddToCartValueFontFamily",
        "cssStyleElementWOOAddToCartValueFontSize",
        "cssStyleElementWOOAddToCartValueLineHeight",
        "cssStyleElementWOOAddToCartValueFontWeight",
        "cssStyleElementWOOAddToCartValueLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },

    ".brz &&:hover table": {
      standart: [
        "cssStyleElementWOOAddToCartTableMargin",
        "cssStyleElementWOOAddToCartTableBoxShadow"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .label, .woocommerce-grouped-product-list-item": {
      standart: ["cssStyleElementWOOAddToCartLabelBg"]
    },
    ".brz &&:hover table td": {
      standart: ["cssStyleElementWOOAddToCartTableBorder"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover td.value select": {
      standart: [
        "cssStyleElementWOOAddToCartTableBorder",
        "cssStyleElementWOOAddToCartValueColor",
        "cssStyleElementWOOAddToCartValueFontFamily",
        "cssStyleElementWOOAddToCartValueFontSize",
        "cssStyleElementWOOAddToCartValueLineHeight",
        "cssStyleElementWOOAddToCartValueFontWeight",
        "cssStyleElementWOOAddToCartValueLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .value": {
      standart: ["cssStyleElementWOOAddToCartTableBg"]
    },
    ".brz &&:hover td.woocommerce-grouped-product-list-item__price": {
      standart: [
        "cssStyleElementWOOAddToCartValueColor",
        "cssStyleElementWOOAddToCartValueFontFamily",
        "cssStyleElementWOOAddToCartValueFontSize",
        "cssStyleElementWOOAddToCartValueLineHeight",
        "cssStyleElementWOOAddToCartValueFontWeight",
        "cssStyleElementWOOAddToCartValueLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
