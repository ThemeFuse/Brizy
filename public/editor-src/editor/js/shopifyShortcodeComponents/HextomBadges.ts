import { t } from "visual/utils/i18n";

export default {
  id: "HextomBadges",
  title: t("Badges by Hextom"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--hextom-badge"],
      items: [
        {
          type: "HextomBadges",
          value: {
            _styles: ["hextom-badge"]
          }
        }
      ]
    }
  }
};
