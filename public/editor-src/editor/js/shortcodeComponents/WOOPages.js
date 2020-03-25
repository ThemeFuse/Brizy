import { t } from "visual/utils/i18n";

export default {
  id: "WOOPages",
  title: t("Pages"),
  icon: "nc-woo-2",
  position: 20,
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WOOPages"],
      items: [
        {
          type: "WOOPages"
        }
      ]
    }
  }
};
