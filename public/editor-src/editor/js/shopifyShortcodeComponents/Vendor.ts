import { t } from "visual/utils/i18n";

export default {
  id: "Product Vendor",
  title: t("Vendor"),
  icon: "t2-shopify-vendor",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper"],
      items: [
        {
          type: "Vendor",
          value: {
            sourceType: "shopify-product"
          }
        }
      ]
    }
  }
};
