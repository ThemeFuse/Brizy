import { t } from "visual/utils/i18n";

export function getItems() {
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
        {
          icon: "nc-hrz-align-left",
          title: t("Horizontal Align"),
          value: "left"
        },
        {
          icon: "nc-hrz-align-right",
          title: t("Horizontal Align"),
          value: "right"
        }
      ]
    },
    {
      id: "verticalAlign",
      type: "toggle-dev",
      position: 90,
      devices: "desktop",
      choices: [
        {
          icon: "nc-ver-align-top",
          title: t("Vertical Align"),
          value: "top"
        },
        {
          icon: "nc-ver-align-middle",
          title: t("Vertical Align"),
          value: "center"
        },
        {
          icon: "nc-ver-align-bottom",
          title: t("Vertical Align"),
          value: "bottom"
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
    }
  ];
}
