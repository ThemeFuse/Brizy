import { t } from "visual/utils/i18n";

export default {
  id: "StampedReviews",
  title: t("Stamped Reviews"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--stamped-reviews"],
      items: [
        {
          type: "StampedReviews",
          value: {
            _styles: ["stamped-reviews"]
          }
        }
      ]
    }
  }
};
