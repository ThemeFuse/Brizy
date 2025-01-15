import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "WOOPages",
    title: t("Pages"),
    icon: "nc-woo-pages",
    position: 20,
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--WOOPages"],
        items: [
          {
            type: "WOOPages"
          }
        ]
      }
    }
  };
}
