import { t } from "visual/utils/i18n";

export default {
  id: "TrustProductRating",
  title: t("Trust Product Rating"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--trust-product-rating"],
      items: [
        {
          type: "TrustProductRating",
          value: {
            _styles: ["trust-product-rating"]
          }
        }
      ]
    }
  }
};
