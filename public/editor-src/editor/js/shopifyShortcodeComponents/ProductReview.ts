import { t } from "visual/utils/i18n";

export default {
  id: "ProductReview",
  title: t("Product Review"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--productReview"],
      items: [
        {
          type: "ProductReview",
          value: {
            _styles: ["productReview"]
          }
        }
      ]
    }
  }
};
