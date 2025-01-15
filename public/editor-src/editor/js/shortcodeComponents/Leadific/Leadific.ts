import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "Leadific",
    title: t("Leadific"),
    icon: "nc-leadific",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper"],
        items: [
          {
            type: "Leadific",
            value: {
              _styles: ["leadific"]
            }
          }
        ]
      }
    }
  };
}
