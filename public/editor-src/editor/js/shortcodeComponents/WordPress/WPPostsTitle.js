import { t } from "visual/utils/i18n";

export default {
  id: "WPPostsTitle",
  title: t("Post Title"),
  icon: "nc-wp-shortcode",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WPPostsTitle"],
      items: [
        {
          type: "WPPostsTitle"
        }
      ]
    }
  }
};
