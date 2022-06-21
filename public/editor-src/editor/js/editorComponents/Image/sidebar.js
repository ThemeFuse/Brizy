import { t } from "visual/utils/i18n";
import { IS_WP } from "visual/utils/env";

import { isSVG, isGIF } from "./utils";

export function getItems(v) {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs-dev",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
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
                  label: t("Basic"),
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
                    },
                    {
                      id: "showOriginalImage",
                      type: "switch-dev",
                      label: t("Show Original image"),
                      disabled:
                        !IS_WP ||
                        isSVG(v.imageExtension) ||
                        isGIF(v.imageExtension) ||
                        !v.imageSrc,
                      devices: "desktop"
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
