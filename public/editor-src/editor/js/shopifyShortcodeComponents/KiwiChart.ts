import { t } from "visual/utils/i18n";

export default {
  id: "KiwiChart",
  title: t("Kiwi Size Chart"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--kiwi-chart"],
      items: [
        {
          type: "KiwiChart",
          value: {
            _styles: ["kiwi-chart"]
          }
        }
      ]
    }
  }
};
