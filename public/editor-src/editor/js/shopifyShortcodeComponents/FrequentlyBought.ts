import { t } from "visual/utils/i18n";

export default {
  id: "FrequentlyBought",
  title: t("Frequently Bought"),
  icon: "nc-cog",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--frequently-bought"],
      items: [
        {
          type: "FrequentlyBought",
          value: {
            _styles: ["frequently-bought"]
          }
        }
      ]
    }
  }
};
