import { t } from "visual/utils/i18n";

export default {
  id: "LimeSpot",
  title: t("Upsells by LimeSpot"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--limespot-upsell"],
      items: [
        {
          type: "LimeSpot",
          value: {
            _styles: ["limespot-upsell"]
          }
        }
      ]
    }
  }
};
