import { t } from "visual/utils/i18n";

export default {
  id: "AddToCart",
  title: t("Add to cart"),
  icon: "nc-woo-add-to-cart",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-addToCart"],
      items: [
        {
          type: "AddToCart",
          value: {
            _styles: ["addToCart"],
            sourceType: "shopify-product"
          }
        }
      ]
    }
  }
};
