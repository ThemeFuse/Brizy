import { t } from "visual/utils/i18n";
import { capitalize } from "visual/utils/string";
import { Toggle } from "visual/utils/options/utils/Type";

export function getItems({ device }) {
  const deviceCapitalize = capitalize(device);
  return [
    {
      id: `showOn${deviceCapitalize}`,
      position: 10,
      type: "showOnDevice",
      devices: "responsive",
      preserveId: true,
      choices: [
        {
          icon: "nc-eye-17",
          title: `${t("Disable on")} ${deviceCapitalize}`,
          value: Toggle.ON
        },
        {
          icon: "nc-eye-ban-18",
          title: `${t("Enable on")} ${deviceCapitalize}`,
          value: Toggle.OFF
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      title: t("Settings"),
      devices: "desktop",
      position: 110,
      roles: ["admin"]
    }
  ];
};
