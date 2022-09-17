import { t } from "visual/utils/i18n";

export default {
  id: "ProductOptions",
  title: t("Product Options"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--product-options"],
      items: [
        {
          type: "ProductOptions",
          value: {
            _styles: ["product-options"]
          }
        }
      ]
    }
  }
};
