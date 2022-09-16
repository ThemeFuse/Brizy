import { t } from "visual/utils/i18n";

export default {
  id: "ReviewVitals",
  title: t("Review by Vitals"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-review-vitals"],
      items: [
        {
          type: "ReviewVitals",
          value: {
            _styles: ["review-vitals"]
          }
        }
      ]
    }
  }
};
