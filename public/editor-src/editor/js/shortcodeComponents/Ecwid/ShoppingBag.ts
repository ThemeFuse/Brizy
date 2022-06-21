import { t } from "visual/utils/i18n";

export default {
  id: "ShoppingBag",
  title: t("Shopping Bag"),
  icon: "nc-woo-cart",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ecwid-shopping-bag"],
      items: [
        {
          type: "EcwidShoppingBag",
          value: {}
        }
      ]
    }
  }
};
