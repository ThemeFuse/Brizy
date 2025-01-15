import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "MenuSimple",
    title: t("Menu"),
    icon: "nc-menu-3",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--WPNavigation"],
        items: [
          {
            type: "WPNavigation"
          }
        ]
      }
    }
  };
}
