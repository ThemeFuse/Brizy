import { t } from "visual/utils/i18n";

export default {
  id: "Products",
  title: t("Products"),
  icon: "nc-woo-products",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ecwid-products"],
      items: [
        {
          type: "EcwidProducts",
          value: {}
        }
      ]
    }
  }
};
