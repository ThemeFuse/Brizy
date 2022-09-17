import { t } from "visual/utils/i18n";

export default {
  id: "ReviewRivyo",
  title: t("Review by Rivyo"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--rivyo-review"],
      items: [
        {
          type: "ReviewRivyo",
          value: {
            _styles: ["rivyo-review"]
          }
        }
      ]
    }
  }
};
