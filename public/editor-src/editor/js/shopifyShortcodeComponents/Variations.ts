import { t } from "visual/utils/i18n";

export default {
  id: "Variations",
  title: t("Variations"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-variations"],
      items: [
        {
          type: "Variations",
          value: {
            _styles: ["variations"]
          }
        }
      ]
    }
  }
};
