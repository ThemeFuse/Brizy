import { t } from "visual/utils/i18n";
import { IS_WP } from "visual/utils/env";

export const title = t("Image");

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
              label: t("Corner"),
              type: "corners-dev"
            }
          ]
        },
        {
          id: "moreSettingsAdvanced",
          label: t("Advanced"),
          icon: "nc-cog",
          options: [
            {
              id: "hoverTransition",
              label: t("Hover Transition"),
              devices: "desktop",
              position: 100,
              type: "slider-dev",
              config: {
                min: 0,
                max: 99,
                units: [{ title: "ms", value: "ms" }]
              }
            },
            {
              id: "alt",
              type: "inputText-dev",
              label: t("Alt Title"),
              display: "block",
              disabled: IS_WP,
              helper: {
                content:
                  "Specify an alternate text for the image, if it cannot be displayed."
              },
              devices: "desktop"
            }
          ]
        }
      ]
    }
  ];
}
