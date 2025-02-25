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

export const disableClick = (node: HTMLElement): void => {
  const pictures = node.querySelectorAll(
    ".ecwid-productBrowser .ec-cart__products-inner .ec-cart__item .ec-cart-item__picture .ec-cart-item__picture-inner"
  );

  pictures.forEach((pic) => {
    pic.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });
};
