import { t } from "visual/utils/i18n";

export default {
  id: "ProductDescription",
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
            sourceType: "shopify-product",
            _styles: ["WPPostContent", "PostExcerpt"]
          }
        }
      ]
    }
  }
};
