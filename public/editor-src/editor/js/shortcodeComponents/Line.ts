import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "line",
    title: t("Line"),
    icon: "nc-divider",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--line"],
        items: [
          {
            type: "Line",
            value: {
              _styles: ["line"]
            }
          }
        ]
      }
    }
  };
}
