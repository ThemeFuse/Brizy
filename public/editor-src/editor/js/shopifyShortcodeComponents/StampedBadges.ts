import { t } from "visual/utils/i18n";

export default {
  id: "StampedBadge",
  title: t("Badges by Stamped"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-stamped-badge"],
      items: [
        {
          type: "StampedBadge",
          value: {
            _styles: ["stamped-badge"]
          }
        }
      ]
    }
  }
};
