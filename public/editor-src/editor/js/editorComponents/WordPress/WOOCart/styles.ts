import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz && .brz-woocart__dc": {
      standart: ["cssStyleBorderRadius"]
    },
    ".brz &&:hover .brz-woocart__dc": {
      standart: ["cssStyleBgColor", "cssStyleBorder"]
    },
    ".brz && .brz-woocart__parent": {
      standart: [
        "cssStyleElementWOOCartSubtotalDisabled",
        "cssStyleSizeSpacing"
      ]
    },
    ".brz && .brz-woocart__price": {
      standart: [
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform"
      ]
    },
    ".brz &&:hover .brz-woocart__price": {
      standart: ["cssStyleColor"]
    },
    ".brz && .brz-woocart__icon:before": {
      standart: ["cssStyleElementWOOCartPurchasesDisabled"]
    },
    ".brz &&:hover .brz-woocart__icon:before": {
      standart: [
        "cssStyleElementWOOCartBubbleColor",
        "cssStyleElementWOOCartBubbleBg"
      ]
    },
    ".brz &&.brz-woocart--plain .brz-woocart__icon:before": {
      standart: [
        "cssStyleSizeSpacing",
        "cssStyleElementWOOCartPurchasesFontFamily",
        "cssStyleElementWOOCartPurchasesFontSize",
        "cssStyleElementWOOCartPurchasesLineHeight",
        "cssStyleElementWOOCartPurchasesFontWeight",
        "cssStyleElementWOOCartPurchasesLetterSpacing",
        "cssStyleElementWOOCartPurchasesFontVariation",
        "cssStyleElementWOOCartPurchasesTextTransform"
      ]
    },
    ".brz &&.brz-woocart--plain:hover .brz-woocart__icon:before": {
      standart: ["cssStyleElementWOOCartPurchasesColor"]
    },
    ".brz && .brz-woocart__icon .brz-icon-svg": {
      standart: [
        "cssStyleElementWOOCartIconSize",
        "cssStyleTypography3LineHeight"
      ]
    },
    ".brz &&:hover .brz-woocart__icon .brz-icon-svg": {
      standart: ["cssStyleElementWOOCartIconColor"]
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
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar__product-name .brz-a":
      {
        standart: [
          "cssStyleElementWOOCartTitleFontFamily",
          "cssStyleElementWOOCartTitleFontSize",
          "cssStyleElementWOOCartTitleLineHeight",
          "cssStyleElementWOOCartTitleFontWeight",
          "cssStyleElementWOOCartTitleLetterSpacing",
          "cssStyleElementWOOCartTitleFontVariation",
          "cssStyleElementWOOCartTitleTextTransform"
        ]
      },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar__product-name .brz-a:hover":
      {
        standart: ["cssStyleElementWOOCartTitleColor"]
      },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar__product-price-parent":
      {
        standart: [
          "cssStyleElementWOOCartCostFontFamily",
          "cssStyleElementWOOCartCostFontSize",
          "cssStyleElementWOOCartCostLineHeight",
          "cssStyleElementWOOCartCostFontWeight",
          "cssStyleElementWOOCartCostLetterSpacing",
          "cssStyleElementWOOCartCostFontVariation",
          "cssStyleElementWOOCartCostTextTransform"
        ]
      },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar__product-price-parent:hover":
      {
        standart: ["cssStyleElementWOOCartCostColor"]
      },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar-subtotal": {
      standart: [
        "cssStyleElementWOOCartSubtotalFontFamily",
        "cssStyleElementWOOCartSubtotalFontSize",
        "cssStyleElementWOOCartSubtotalLineHeight",
        "cssStyleElementWOOCartSubtotalFontWeight",
        "cssStyleElementWOOCartSubtotalLetterSpacing",
        "cssStyleElementWOOCartSubtotalFontVariation",
        "cssStyleElementWOOCartSubtotalTextTransform"
      ]
    },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar-subtotal:hover": {
      standart: ["cssStyleElementWOOCartSubtotalColor"]
    },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar-button": {
      standart: [
        "cssStyleElementWOOCartButtonBorderRadius",
        "cssStyleElementWOOCartButtonSpacing",
        "cssStyleElementWOOCartButtonFontFamily",
        "cssStyleElementWOOCartButtonFontSize",
        "cssStyleElementWOOCartButtonLineHeight",
        "cssStyleElementWOOCartButtonFontWeight",
        "cssStyleElementWOOCartButtonLetterSpacing",
        "cssStyleElementWOOCartButtonFontVariation",
        "cssStyleElementWOOCartButtonTextTransform"
      ]
    },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar-button:hover": {
      standart: [
        "cssStyleElementWOOCartButtonBgColor",
        "cssStyleElementWOOCartButtonColor"
      ]
    },
    ".brz && .brz-woocart__sidebar .brz-woocart__sidebar-buttons": {
      standart: ["cssStyleElementWOOCartButtonDirection"]
    },
    ".brz && .brz-woocart__sidebar-remove .brz-icon-svg:hover": {
      standart: ["cssStyleElementWOOCartCostColor"]
    },
    ".brz && .brz-woocart__sidebar-remove .brz-icon-svg, .brz && .brz-woocart__sidebar .brz-woocart__sidebar-button, .brz && .brz-woocart__sidebar .brz-woocart__sidebar-subtotal, .brz && .brz-woocart__sidebar .brz-woocart__sidebar__product-price-parent, .brz && .brz-woocart__sidebar .brz-woocart__sidebar__product-name .brz-a, .brz && .brz-woocart__dc, .brz && .brz-woocart__price, .brz &&.brz-woocart--plain .brz-woocart__icon:before, .brz && .brz-woocart__icon .brz-icon-svg":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
