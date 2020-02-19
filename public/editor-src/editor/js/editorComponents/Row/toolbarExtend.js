import { t } from "visual/utils/i18n";
export function getItems() {
  return [
    {
      id: "reverseColumns",
      type: "toggle-dev",
      devices: "responsive",
      position: 20,
      choices: [
        {
          icon: "nc-switch",
          title: t("Reverse Columns"),
          value: "on"
        },
        {
          icon: "nc-switch",
          title: t("Reverse Columns"),
          value: "off"
        }
      ]
    }
  ];
}
