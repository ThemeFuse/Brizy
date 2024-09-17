import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { capitalize } from "visual/utils/string";
import { Toggle } from "visual/utils/options/utils/Type";

export const getItems: GetItems = ({ device }) => {
  const deviceCapitalize = capitalize(device);
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
      id: "advancedSettings",
      type: "advancedSettings",
      title: t("Settings"),
      devices: "desktop",
      position: 110,
      roles: ["admin"]
    }
  ];
};
