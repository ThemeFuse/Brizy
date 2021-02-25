import { t } from "visual/utils/i18n";
import { toolbarDisabledAdvancedSettings } from "visual/utils/toolbar";

export function getItems({ device }) {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-star"
      },
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Icon"),
              options: [
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider-dev",
                  devices: "desktop",
                  position: 70,
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "iconPosition",
      type: "toggle-dev",
      position: 90,
      devices: "desktop",
      choices: [
        { icon: "nc-hrz-align-left", title: t("Align"), value: "left" },
        { icon: "nc-hrz-align-right", title: t("Align"), value: "right" }
      ]
    },
    toolbarDisabledAdvancedSettings({ device })
  ];
}
