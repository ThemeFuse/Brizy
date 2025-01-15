import { t } from "visual/utils/i18n";

export const title = () => t("Text");

export function getItems() {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              config: {
                align: "start"
              },
              devices: "desktop",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  icon: "nc-styling",
                  options: [
                    {
                      id: "blendMode",
                      label: t("Blending Mode"),
                      type: "select",
                      devices: "desktop",
                      position: 80,
                      choices: [
                        { title: t("Normal"), value: "normal" },
                        { title: t("Color"), value: "color" },
                        { title: t("Color Burn"), value: "color-burn" },
                        { title: t("Color Dodge"), value: "color-dodge" },
                        { title: t("Darken"), value: "darken" },
                        { title: t("Difference"), value: "difference" },
                        { title: t("Exclusion"), value: "exclusion" },
                        { title: t("Hue"), value: "hue" },
                        { title: t("Lighten"), value: "lighten" },
                        { title: t("Luminosity"), value: "luminosity" },
                        { title: t("Multiply"), value: "multiply" },
                        { title: t("Overlay"), value: "overlay" },
                        { title: t("Saturation"), value: "saturation" },
                        { title: t("Screen"), value: "screen" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
