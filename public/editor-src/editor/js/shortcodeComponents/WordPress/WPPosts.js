import { t } from "visual/utils/i18n";

export default {
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
