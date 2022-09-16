import { t } from "visual/utils/i18n";

export default {
  id: "AliExpressReview",
  title: t("Review by AliExpress"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--aliExpress-review"],
      items: [
        {
          type: "AliExpressReview",
          value: {
            _styles: ["aliExpress-review"]
          }
        }
      ]
    }
  }
};
