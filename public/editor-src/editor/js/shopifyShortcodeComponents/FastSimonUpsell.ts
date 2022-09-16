import { t } from "visual/utils/i18n";

export default {
  id: "FastSimonUpsell",
  title: t("Upsell by FastSimon"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--fast-simon-upsell"],
      items: [
        {
          type: "FastSimonUpsell",
          value: {
            _styles: ["fast-simon-upsell"]
          }
        }
      ]
    }
  }
};
