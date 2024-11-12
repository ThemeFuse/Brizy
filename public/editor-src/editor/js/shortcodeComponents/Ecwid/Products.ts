import { t } from "visual/utils/i18n";

export default {
  id: "Products",
  title: t("Products"),
  upgradeMessage: t("You need the Shop Add-on to use this"),
  upgradeActionMessage: t("Get Shop Add-On"),
  icon: "nc-woo-products",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ecwid-products"],
      items: [
        {
          type: "EcwidProducts",
          value: { _styles: ["products"] }
        }
      ]
    }
  }
};
