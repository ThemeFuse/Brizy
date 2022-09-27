import { t } from "visual/utils/i18n";

export default {
  id: "OkendoReview",
  title: t("Review by Okendo"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--okendo-review"],
      items: [
        {
          type: "OkendoReview",
          value: {
            _styles: ["okendo-review"]
          }
        }
      ]
    }
  }
};
