import { t } from "visual/utils/i18n";

export default {
  id: "LaiReviews",
  title: t("Reviews by Lai"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--lai-reviews"],
      items: [
        {
          type: "LaiReviews",
          value: {
            _styles: ["lai-reviews"]
          }
        }
      ]
    }
  }
};
