import { t } from "visual/utils/i18n";

export default {
  id: "Cart",
  title: t("Cart & Checkout"),
  icon: "nc-woo-add-to-cart",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ecwid-cart"],
      items: [
        {
          type: "EcwidCart",
          value: { _styles: ["cart"] }
        }
      ]
    }
  }
};
