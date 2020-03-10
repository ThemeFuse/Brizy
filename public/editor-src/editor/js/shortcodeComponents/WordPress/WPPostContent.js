const { t } = global.Brizy;

export default {
  id: "WPPostContent",
  title: t("Post Content"),
  icon: "nc-wp-shortcode",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WPPostContent"],
      items: [
        {
          type: "WPPostContent"
        }
      ]
    }
  }
};
