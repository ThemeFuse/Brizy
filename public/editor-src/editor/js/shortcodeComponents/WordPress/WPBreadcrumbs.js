const { t } = global.Brizy;

export default {
  id: "WPBreadcrumbs",
  title: t("Breadcrumbs"),
  icon: "nc-wp-shortcode",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WPBreadcrumbs"],
      items: [
        {
          type: "WPBreadcrumbs"
        }
      ]
    }
  }
};
