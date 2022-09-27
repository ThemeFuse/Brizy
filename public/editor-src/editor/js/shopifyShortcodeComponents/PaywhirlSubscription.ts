import { t } from "visual/utils/i18n";

export default {
  id: "PaywhirlSubscription",
  title: t("Subscribtion by Paywhirl"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--paywhirl-subscription"],
      items: [
        {
          type: "PaywhirlSubscription",
          value: {
            _styles: ["paywhirl-subscription"]
          }
        }
      ]
    }
  }
};
