import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "WPCustomShortcode",
    title: t("Shortcode"),
    icon: "nc-wp-shortcode-element",
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
}
