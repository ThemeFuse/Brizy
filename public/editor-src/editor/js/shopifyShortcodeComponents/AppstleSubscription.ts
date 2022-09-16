import { t } from "visual/utils/i18n";

export default {
  id: "AppstleSubscription",
  title: t("Subscription by Appstle"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--appstle-subscription"],
      items: [
        {
          type: "AppstleSubscription",
          value: {
            _styles: ["appstle-subscription"]
          }
        }
      ]
    }
  }
};
