import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { capitalize } from "visual/utils/string";
import { Toggle } from "visual/utils/options/utils/Type";

export const getItems = ({ v, device }) => {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const deviceCapitalize = capitalize(device);
  // Don't send items down because they will likely
  // be disabled below as Wrapper uses them itself (see toolbar.js)
  if (dvv("showToolbar") === "on") {
    return [];
  }

  return [
    {
      id: `showOn${deviceCapitalize}`,
      type: "showOnDevice",
      devices: "responsive",
      position: 10,
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
    }
  ];
};
