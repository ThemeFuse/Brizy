import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "WPPosts",
    title: t("Posts"),
    icon: "nc-wp-shortcode",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--WPPosts"],
        items: [
          {
            type: "WPPosts"
          }
        ]
      }
    }
  };
}
