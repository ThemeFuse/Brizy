import { t } from "visual/utils/i18n";
import { toolbarShowOnResponsive } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    toolbarShowOnResponsive({
      v,
      device,
      state: "normal",
      devices: "responsive"
    }),
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeTab",
              options: [
                {
                  id: "itemPadding",
                  type: "slider-dev",
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
