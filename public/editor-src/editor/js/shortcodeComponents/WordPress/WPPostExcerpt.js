const { t } = global.Brizy;

export default {
  id: "WPPostExcerpt",
  title: t("Post Excerpt"),
  icon: "nc-wp-shortcode",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WPPostExcerpt"],
      items: [
        {
          type: "WPPostExcerpt"
        }
      ]
    }
  }
};
