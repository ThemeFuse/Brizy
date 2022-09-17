import { t } from "visual/utils/i18n";

export default {
  id: "ZeptoPersonalizer",
  title: t("Personalizer by Zepto"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--zepto-personalizer"],
      items: [
        {
          type: "ZeptoPersonalizer",
          value: {
            _styles: ["zepto-personalizer"]
          }
        }
      ]
    }
  }
};
