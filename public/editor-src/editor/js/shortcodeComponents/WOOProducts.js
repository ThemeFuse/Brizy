import { t } from "visual/utils/i18n";

export default {
  id: "WOOProducts",
  title: t("Products"),
  icon: "nc-woo-2",
  position: 20,
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WOOProducts"],
      items: [
        {
          type: "WOOProducts"
        }
      ]
    }
  }
};
