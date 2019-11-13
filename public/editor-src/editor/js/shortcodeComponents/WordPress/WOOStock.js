import { t } from "visual/utils/i18n";

export default {
  id: "WOOStock",
  title: t("Stock"),
  icon: "nc-woo-2",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WOOStock"],
      items: [
        {
          type: "WOOStock"
        }
      ]
    }
  }
};