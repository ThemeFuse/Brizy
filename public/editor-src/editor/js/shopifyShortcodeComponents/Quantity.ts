import { t } from "visual/utils/i18n";

export default {
  id: "Quantity",
  title: t("Quantity"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-quantity"],
      items: [
        {
          type: "Quantity",
          value: {
            _styles: ["quantity"]
          }
        }
      ]
    }
  }
};
