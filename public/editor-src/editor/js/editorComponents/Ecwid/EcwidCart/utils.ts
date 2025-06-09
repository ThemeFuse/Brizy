import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { onOffToBool } from "visual/utils/boolean";
import { Value } from "./types/Value";

export function valueToEciwdConfig(v: Value): EcwidConfig {
  return {
    show_footer_menu: onOffToBool(v.footerDisplay),
    shopping_cart_show_qty_inputs: onOffToBool(v.qtyDisplay),
    shopping_cart_show_sku: onOffToBool(v.skuDisplay),
    shopping_cart_show_weight: onOffToBool(v.weightDisplay),
    shopping_cart_products_collapsed_on_desktop: onOffToBool(v.collapseDesktop),
    checkout_show_address_line_2: true,
    show_breadcrumbs: false
  };
}

export const addListenerToContinueShopping = (node: HTMLElement) => () => {
  const button = node.querySelector(
    ".ec-store.ec-store__confirmation-page .ec-confirmation__continue .form-control.form-control--done"
  );

  if (button) {
    button.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        window.location.href = "/";
      },
      true
    );
  }
};
