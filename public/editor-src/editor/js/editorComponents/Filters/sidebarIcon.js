import { t } from "visual/utils/i18n";

export const title = t("Icon");

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
              id: "checkIconBorder",
              type: "corners-dev",
              label: t("Corner"),
              devices: "desktop",
              prefix: "checkIcon",
              position: 65
            }
          ]
        }
      ]
    }
  ];
}
