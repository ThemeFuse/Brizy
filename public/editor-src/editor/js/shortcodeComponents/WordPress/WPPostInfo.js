const { t } = global.Brizy;

export default {
  id: "WPPostInfo",
  title: t("Post info"),
  icon: "nc-wp-shortcode",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WPPostInfo"],
      items: [
        {
          type: "WPPostInfo"
        }
      ]
    }
  }
};
