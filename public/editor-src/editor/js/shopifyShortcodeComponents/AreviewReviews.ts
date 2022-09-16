import { t } from "visual/utils/i18n";

export default {
  id: "AreviewReviews",
  title: t("Reviews by Areview"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--areview-reviews"],
      items: [
        {
          type: "AreviewReviews",
          value: {
            _styles: ["areview-reviews"]
          }
        }
      ]
    }
  }
};
