import { t } from "visual/utils/i18n";

export default {
  id: "LooxReview",
  title: t("Review by Loox"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--loox-review"],
      items: [
        {
          type: "LooxReview",
          value: {
            _styles: ["loox-review"]
          }
        }
      ]
    }
  }
};
