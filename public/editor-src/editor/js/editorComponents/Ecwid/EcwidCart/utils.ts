import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { Value } from "./types/Value";
import { onOffToBool } from "visual/utils/boolean";

export function valueToEciwdConfig(v: Value): EcwidConfig {
  return {
    show_footer_menu: onOffToBool(v.footerDisplay),
    shopping_cart_show_qty_inputs: onOffToBool(v.qtyDisplay),
    shopping_cart_show_sku: onOffToBool(v.skuDisplay),
    shopping_cart_show_weight: onOffToBool(v.weightDisplay),
    checkout_show_state_input: onOffToBool(v.inputDisplay),
    checkout_show_address_line_2: onOffToBool(v.addressDisplay),
    shopping_cart_products_collapsed_on_desktop: onOffToBool(v.collapseDesktop),
    show_breadcrumbs: onOffToBool(v.breadcrumbsDisplay)
  };
}
