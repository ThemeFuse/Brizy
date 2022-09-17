import { t } from "visual/utils/i18n";

export default {
  id: "AliReviews",
  title: t("Reviews by Ali"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--reviews-ali"],
      items: [
        {
          type: "AliReviews",
          value: {
            _styles: ["reviews-ali"]
          }
        }
      ]
    }
  }
};
