import { hasInfiniteAnimation } from "visual/component/HoverAnimation/utils";
import { hoverEffects } from "visual/component/Options/types/dev/Animation/utils";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { read as readString } from "visual/utils/string/specs";
import { GetItems } from "../EditorComponent/types";
import { Value } from "./index";

export const title = t("Map");

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const IS_STORY = isStory(Config.getAll());

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const hoverName = readString(dvv("hoverName")) ?? "none";

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
                  options: [
                    {
                      id: "padding",
                      type: "padding",
                      label: t("Padding"),
                      disabled: true
                    },
                    {
                      id: "bgPadding",
                      type: "padding",
                      label: t("Padding"),
                      position: 50
                    },
                    {
                      id: "border",
                      type: "corners",
                      label: t("Corner"),
                      devices: "desktop",
                      position: 65
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  options: [
                    {
                      id: "hoverTransition",
                      label: t("Hover Transition"),
                      disabled: IS_STORY,
                      devices: "desktop",
                      position: 100,
                      type: "slider",
                      config: {
                        min: 0,
                        max: 99,
                        units: [{ title: "ms", value: "ms" }]
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "padding",
              type: "padding",
              label: t("Padding"),
              devices: "responsive",
              disabled: true
            },
            {
              id: "bgPadding",
              type: "padding",
              label: t("Padding"),
              devices: "responsive",
              position: 50
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
              type: "tabs",
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
                      type: "animation",
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
};
