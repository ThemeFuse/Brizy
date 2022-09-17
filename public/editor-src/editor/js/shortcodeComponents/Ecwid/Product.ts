import { t } from "visual/utils/i18n";

export default {
  id: "Product",
  title: t("Product"),
  icon: "nc-woo-related-products",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-ecwid-product"],
      items: [
        {
          type: "EcwidProduct",
          value: { _styles: ["product"] }
        }
      ]
    }
  }
};
