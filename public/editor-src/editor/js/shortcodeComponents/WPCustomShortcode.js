import { t } from "visual/utils/i18n";

export default {
  id: "WPCustomShortcode",
  title: t("Shortcode"),
  icon: "nc-wp-shortcode",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WPCustomShortcode"],
      items: [
        {
          type: "WPCustomShortcode"
        }
      ]
    }
  }
};
