import { t } from "visual/utils/i18n";

export default {
  id: "ZoorixUpsell",
  title: t("Upsell by Zoorix"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--zoorix-upsell"],
      items: [
        {
          type: "ZoorixUpsell",
          value: {
            _styles: ["zoorix-upsell"]
          }
        }
      ]
    }
  }
};
