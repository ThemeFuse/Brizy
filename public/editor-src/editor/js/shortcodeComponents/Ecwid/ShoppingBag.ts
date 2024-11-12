import { t } from "visual/utils/i18n";

export default {
  id: "shoppingBag",
  title: t("Shopping Bag"),
  upgradeMessage: t("You need the Shop Add-on to use this"),
  upgradeActionMessage: t("Get Shop Add-On"),
  icon: "nc-shopping-bag",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ecwid-shopping-bag"],
      items: [
        {
          type: "EcwidShoppingBag",
          value: { _styles: ["shoppingBag"] }
        }
      ]
    }
  }
};
