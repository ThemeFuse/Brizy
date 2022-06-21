import { t } from "visual/utils/i18n";

export const title = t("Select Item");

export function getItems() {
  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      devices: "desktop",
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          icon: "nc-styling",
          options: [
            {
              id: "selectItemPadding",
              type: "padding-dev",
              label: t("Padding"),
              position: 50
            }
          ]
        }
      ]
    }
  ];
}
