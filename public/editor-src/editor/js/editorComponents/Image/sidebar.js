import { hasInfiniteAnimation } from "visual/component/HoverAnimation/utils";
import { hoverEffects } from "visual/component/Options/types/dev/Animation/utils";
import { IS_WP } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { read as readString } from "visual/utils/string/specs";
import { isGIF, isSVG } from "./utils";
import { isStory } from "visual/utils/models";
import Config from "visual/global/Config";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const imageExtension = dvv("imageExtension");
  const imageSrc = dvv("imageSrc");
  const hoverName = readString(dvv("hoverName")) ?? "none";

  const IS_STORY = isStory(Config.getAll());

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
                        isSVG(imageExtension) ||
                        isGIF(imageExtension) ||
                        !imageSrc,
                      devices: "desktop"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "effects",
          title: t("Effects"),
          label: t("Effects"),
          options: [
            {
              id: "tabs",
              type: "tabs-dev",
              config: {
                align: "start"
              },
              tabs: [
                {
                  id: "entrance",
                  label: t("Entrance"),
                  options: []
                },
                {
                  id: "tabHover",
                  label: t("Hover"),
                  options: [
                    {
                      id: "hover",
                      type: "animation-dev",
                      devices: "desktop",
                      disabled: IS_STORY,
                      config: {
                        types: hoverEffects,
                        replay: false,
                        infiniteAnimation: hasInfiniteAnimation(hoverName),
                        delay: false
                      }
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
