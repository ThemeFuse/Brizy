import { t } from "visual/utils/i18n";

export default {
  id: "RechargeSubscriptions",
  title: t("Subscriptions by Recharge"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--recharge-subscriptions"],
      items: [
        {
          type: "RechargeSubscriptions",
          value: {
            _styles: ["recharge-subscriptions"]
          }
        }
      ]
    }
  }
};
