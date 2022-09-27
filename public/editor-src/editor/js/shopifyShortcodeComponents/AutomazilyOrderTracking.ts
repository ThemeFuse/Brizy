import { t } from "visual/utils/i18n";

export default {
  id: "AutomizelyOrderTracking",
  title: t("Order Tracking by Automazily"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--automizely-order-tracking"],
      items: [
        {
          type: "AutomizelyOrderTracking",
          value: {
            _styles: ["automizely-order-tracking"]
          }
        }
      ]
    }
  }
};
