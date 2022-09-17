import { t } from "visual/utils/i18n";

export default {
  id: "OmegaTracking",
  title: t("Tracking by Omega"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--omega-tracking"],
      items: [
        {
          type: "OmegaTracking",
          value: {
            _styles: ["omega-tracking"]
          }
        }
      ]
    }
  }
};
