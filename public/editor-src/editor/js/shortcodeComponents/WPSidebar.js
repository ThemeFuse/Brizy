import { t } from "visual/utils/i18n";

export default {
  id: "WPSidebar",
  title: t("Sidebar"),
  icon: "nc-wp-post-sidebar",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--WPSidebar"],
      items: [
        {
          type: "WPSidebar"
        }
      ]
    }
  }
};
