import { t } from "visual/utils/i18n";

export default {
  id: "TrustProductReview",
  title: t("Trust Product Review"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--trust-product-review"],
      items: [
        {
          type: "TrustProductReview",
          value: {
            _styles: ["trust-product-review"]
          }
        }
      ]
    }
  }
};
