import { t } from "visual/utils/i18n";

export default {
  id: "BlogPostContent",
  title: t("Description"),
  icon: "nc-wp-post-content",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper"],
      items: [
        {
          type: "WPPostContent",
          value: {
            sourceType: "shopify-article",
            _styles: ["WPPostContent", "BlogPostContent"]
          }
        }
      ]
    }
  }
};
