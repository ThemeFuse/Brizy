import { t } from "visual/utils/i18n";
import { capitalize } from "visual/utils/string";
import { Toggle } from "visual/utils/options/utils/Type";

export function getItems({ v, device }) {
  const deviceCapitalize = capitalize(device);
  return [
    {
      id: "horizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
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
      id: "toolbarCurrentShortcode",
      type: "popover",
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              options: [
                {
                  id: "itemPadding",
                  type: "slider",
                  label: t("Spacing"),
                  roles: ["admin"],
                  position: 350,
                  config: {
                    min: 0,
                    max: 100,
                    units: [
                      {
                        title: "px",
                        value: "px"
                      }
                    ]
                  },
                  disabled: v.items.length === 1
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
