import { t } from "visual/utils/i18n";

export default {
  id: "ReviewJudgeMe",
  title: t("Review by Judge"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--review-judge"],
      items: [
        {
          type: "ReviewJudgeMe",
          value: {
            _styles: ["review-judge"]
          }
        }
      ]
    }
  }
};
