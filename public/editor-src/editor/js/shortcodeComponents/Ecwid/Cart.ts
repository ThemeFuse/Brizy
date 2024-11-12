import { t } from "visual/utils/i18n";

export default {
  id: "Cart",
  title: t("Cart & Checkout"),
  upgradeMessage: t("You need the Shop Add-on to use this"),
  upgradeActionMessage: t("Get Shop Add-On"),
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
