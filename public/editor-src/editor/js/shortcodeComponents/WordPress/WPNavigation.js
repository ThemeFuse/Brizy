import { t } from "visual/utils/i18n";

export default {
  id: "WPNavigation",
  title: t("Menu"),
  icon: "nc-wp-shortcode",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WPNavigation"],
      items: [
        {
          type: "WPNavigation"
        }
      ]
    }
  }
};
