import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "Alert",
    title: t("Alert"),
    icon: "nc-alert",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--alert"],
        items: [
          {
            type: "Alert"
          }
        ]
      }
    }
  };
}
