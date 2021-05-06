import { t } from "visual/utils/i18n";

export default {
  id: "PostTitle",
  title: t("Title"),
  icon: "nc-wp-post-title",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper-postTitle"],
      items: [
        {
          type: "WPPostsTitle",
          value: {
            _styles: ["postTitle"]
          }
        }
      ]
    }
  }
};
