import { t } from "visual/utils/i18n";

export default {
  id: "ReviewOpinew",
  title: t("Review by Opinew"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-opiniew-review"],
      items: [
        {
          type: "ReviewOpinew",
          value: {
            _styles: ["opiniew-review"]
          }
        }
      ]
    }
  }
};
