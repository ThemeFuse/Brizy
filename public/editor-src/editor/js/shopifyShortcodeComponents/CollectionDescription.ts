import { t } from "visual/utils/i18n";

export default {
  id: "CollectionDescription",
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
            sourceType: "shopify-collection",
            _styles: ["WPPostContent", "CollectionDescription"]
          }
        }
      ]
    }
  }
};
