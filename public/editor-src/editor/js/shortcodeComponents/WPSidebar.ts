import { t } from "visual/utils/i18n";

export default function () {
  return {
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
}
