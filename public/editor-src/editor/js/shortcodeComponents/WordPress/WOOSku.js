import { t } from "visual/utils/i18n";

export default {
  id: "WOOSku",
  title: t("Sku"),
  icon: "nc-woo-2",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WOOSku"],
      items: [
        {
          type: "WOOSku"
        }
      ]
    }
  }
};
