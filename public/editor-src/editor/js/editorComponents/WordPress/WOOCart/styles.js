import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleBgColor", "cssStyleBorder", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementWOOCartTransitionProperty"
      ]
    },
    ".brz &&:hover .brz-woocart__parent": {
      standart: [
        "cssStyleElementWOOCartSubtotalDisabled",
        "cssStyleSizeSpacing"
      ]
    },
    ".brz &&:hover .brz-woocart__price": {
      standart: [
        "cssStyleColor",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementWOOCartTransitionProperty"
      ]
    },
    ".brz &&:hover .brz-woocart__icon:before": {
      standart: ["cssStyleElementWOOCartPurchasesDisabled"]
    },
    ".brz &&.brz-purchases-plain:hover .brz-woocart__icon:before": {
      standart: [
        "cssStyleSizeSpacing",
        "cssStyleElementWOOCartPurchasesColor",
        "cssStyleElementWOOCartPurchasesFontFamily",
        "cssStyleElementWOOCartPurchasesFontSize",
        "cssStyleElementWOOCartPurchasesLineHeight",
        "cssStyleElementWOOCartPurchasesFontWeight",
        "cssStyleElementWOOCartPurchasesLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementWOOCartTransitionProperty"
      ]
    },
    ".brz &&:hover .brz-woocart__icon .brz-icon-svg": {
      standart: [
        "cssStyleElementWOOCartIconColor",
        "cssStyleIconSize",
        "cssStyleTypography3LineHeight"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementWOOCartTransitionProperty"
      ]
    },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar__product-name .brz-a:hover": {
      standart: [
        "cssStyleElementWOOCartTitleColor",
        "cssStyleElementWOOCartTitleFontFamily",
        "cssStyleElementWOOCartTitleFontSize",
        "cssStyleElementWOOCartTitleLineHeight",
        "cssStyleElementWOOCartTitleFontWeight",
        "cssStyleElementWOOCartTitleLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementWOOCartTransitionProperty"
      ]
    },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar__product-price-parent:hover": {
      standart: [
        "cssStyleElementWOOCartCostColor",
        "cssStyleElementWOOCartCostFontFamily",
        "cssStyleElementWOOCartCostFontSize",
        "cssStyleElementWOOCartCostLineHeight",
        "cssStyleElementWOOCartCostFontWeight",
        "cssStyleElementWOOCartCostLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementWOOCartTransitionProperty"
      ]
    },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar-subtotal:hover": {
      standart: [
        "cssStyleElementWOOCartSubtotalColor",
        "cssStyleElementWOOCartSubtotalFontFamily",
        "cssStyleElementWOOCartSubtotalFontSize",
        "cssStyleElementWOOCartSubtotalLineHeight",
        "cssStyleElementWOOCartSubtotalFontWeight",
        "cssStyleElementWOOCartSubtotalLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementWOOCartTransitionProperty"
      ]
    },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar-button:hover": {
      standart: [
        "cssStyleElementWOOCartButtonBorderRadius",
        "cssStyleElementWOOCartButtonSpacing",
        "cssStyleElementWOOCartButtonBgColor",
        "cssStyleElementWOOCartButtonColor",
        "cssStyleElementWOOCartButtonFontFamily",
        "cssStyleElementWOOCartButtonFontSize",
        "cssStyleElementWOOCartButtonLineHeight",
        "cssStyleElementWOOCartButtonFontWeight",
        "cssStyleElementWOOCartButtonLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementWOOCartTransitionProperty"
      ]
    },
    ".brz &&:hover .brz-woocart__sidebar .brz-woocart__sidebar-buttons": {
      standart: ["cssStyleElementWOOCartButtonDirection"]
    },
    ".brz && .brz-woocart__sidebar-remove .brz-icon-svg:hover": {
      standart: ["cssStyleElementWOOCartCostColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementWOOCartTransitionProperty"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
