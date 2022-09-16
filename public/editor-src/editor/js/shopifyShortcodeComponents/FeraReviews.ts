import { t } from "visual/utils/i18n";

export default {
  id: "FeraReviews",
  title: t("Reviews by Fera"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-fera-reviews"],
      items: [
        {
          type: "FeraReviews",
          value: {
            _styles: ["fera-reviews"]
          }
        }
      ]
    }
  }
};
