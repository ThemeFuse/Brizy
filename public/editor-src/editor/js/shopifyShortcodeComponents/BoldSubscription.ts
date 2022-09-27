import { t } from "visual/utils/i18n";

export default {
  id: "BoldSubscription",
  title: t("Subscription by Bold"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--bold-subscription"],
      items: [
        {
          type: "BoldSubscription",
          value: {
            _styles: ["bold-subscription"]
          }
        }
      ]
    }
  }
};
