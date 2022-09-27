import { t } from "visual/utils/i18n";

export default {
  id: "SealSubscription",
  title: t("Subscription by Seal"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--seal-subscription"],
      items: [
        {
          type: "SealSubscription",
          value: {
            _styles: ["seal-subscription"]
          }
        }
      ]
    }
  }
};
