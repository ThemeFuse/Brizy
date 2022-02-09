import { t } from "visual/utils/i18n";

export default {
  id: "Price",
  title: t("Price"),
  icon: "nc-woo-add-to-cart",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-price"],
      items: [
        {
          type: "Price",
          value: {
            _styles: ["price"]
          }
        }
      ]
    }
  }
};
