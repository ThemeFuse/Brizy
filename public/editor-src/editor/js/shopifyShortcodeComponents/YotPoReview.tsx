import { t } from "visual/utils/i18n";

export default {
  id: "YotPoReview",
  title: t("YotPo Product Review"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--yot-po-review"],
      items: [
        {
          type: "YotPoReview",
          value: {
            _styles: ["yot-po-review"]
          }
        }
      ]
    }
  }
};
