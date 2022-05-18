import { t } from "visual/utils/i18n";

export const title = t("Button");

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
              id: "border",
              type: "corners-dev",
              label: t("Corner"),
              devices: "desktop",
              position: 65
            }
          ]
        }
      ]
    }
  ];
}
