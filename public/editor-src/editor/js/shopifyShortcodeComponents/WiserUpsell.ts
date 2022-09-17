import { t } from "visual/utils/i18n";

export default {
  id: "WiserUpsell",
  title: t("Upsell by Wiser"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--wiser-upsell"],
      items: [
        {
          type: "WiserUpsell",
          value: {
            _styles: ["wiser-upsell"]
          }
        }
      ]
    }
  }
};
