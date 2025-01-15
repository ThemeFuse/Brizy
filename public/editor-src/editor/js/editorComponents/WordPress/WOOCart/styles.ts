import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&:hover .brz-woocart__dc": {
      standart: ["cssStyleBgColor", "cssStyleBorder", "cssStyleBorderRadius"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-woocart__icon:before": {
      standart: [
        "cssStyleElementWOOCartPurchasesDisabled",
        "cssStyleElementWOOCartBubbleColor",
        "cssStyleElementWOOCartBubbleBg"
      ]
    },
    ".brz &&.brz-woocart--plain:hover .brz-woocart__icon:before": {
      standart: [
        "cssStyleSizeSpacing",
        "cssStyleElementWOOCartPurchasesColor",
        "cssStyleElementWOOCartPurchasesFontFamily",
        "cssStyleElementWOOCartPurchasesFontSize",
        "cssStyleElementWOOCartPurchasesLineHeight",
        "cssStyleElementWOOCartPurchasesFontWeight",
        "cssStyleElementWOOCartPurchasesLetterSpacing",
        "cssStyleElementWOOCartPurchasesFontVariation",
        "cssStyleElementWOOCartPurchasesTextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-woocart__icon .brz-icon-svg": {
      standart: [
        "cssStyleElementWOOCartIconColor",
        "cssStyleElementWOOCartIconSize",
        "cssStyleTypography3LineHeight"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-woocart__sidebar": {
      standart: [
        "cssStyleElementWOOCartSidebarWidth",
        "cssStyleElementWOOCartSidebarHeight",
        "cssStyleElementWOOCartSidebarHorizontalAlign",
        "cssStyleElementWOOCartSidebarVerticalAlign",
        "cssStyleElementWOOCartSidebarBgColor"
      ]
    },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar__product-name .brz-a:hover":
      {
        standart: [
          "cssStyleElementWOOCartTitleColor",
          "cssStyleElementWOOCartTitleFontFamily",
          "cssStyleElementWOOCartTitleFontSize",
          "cssStyleElementWOOCartTitleLineHeight",
          "cssStyleElementWOOCartTitleFontWeight",
          "cssStyleElementWOOCartTitleLetterSpacing",
          "cssStyleElementWOOCartTitleFontVariation",
          "cssStyleElementWOOCartTitleTextTransform"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar__product-price-parent:hover":
      {
        standart: [
          "cssStyleElementWOOCartCostColor",
          "cssStyleElementWOOCartCostFontFamily",
          "cssStyleElementWOOCartCostFontSize",
          "cssStyleElementWOOCartCostLineHeight",
          "cssStyleElementWOOCartCostFontWeight",
          "cssStyleElementWOOCartCostLetterSpacing",
          "cssStyleElementWOOCartCostFontVariation",
          "cssStyleElementWOOCartCostTextTransform"
        ],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar-subtotal:hover": {
      standart: [
        "cssStyleElementWOOCartSubtotalColor",
        "cssStyleElementWOOCartSubtotalFontFamily",
        "cssStyleElementWOOCartSubtotalFontSize",
        "cssStyleElementWOOCartSubtotalLineHeight",
        "cssStyleElementWOOCartSubtotalFontWeight",
        "cssStyleElementWOOCartSubtotalLetterSpacing",
        "cssStyleElementWOOCartSubtotalFontVariation",
        "cssStyleElementWOOCartSubtotalTextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
        "cssStyleElementWOOCartButtonLetterSpacing",
        "cssStyleElementWOOCartButtonFontVariation",
        "cssStyleElementWOOCartButtonTextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-woocart__sidebar .brz-woocart__sidebar-buttons": {
      standart: ["cssStyleElementWOOCartButtonDirection"]
    },
    ".brz && .brz-woocart__sidebar-remove .brz-icon-svg:hover": {
      standart: ["cssStyleElementWOOCartCostColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
