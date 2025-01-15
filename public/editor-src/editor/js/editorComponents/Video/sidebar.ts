import { hasInfiniteAnimation } from "visual/component/HoverAnimation/utils";
import { isStory } from "visual/global/EditorModeContext";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { hoverEffects } from "visual/utils/options/Animation/utils";
import { read as readString } from "visual/utils/string/specs";
import { GetItems } from "../EditorComponent/types";
import { bgPaddingCSS, transitionCSS } from "./css";
import type { Value } from "./types";

export const title = () => t("Video");

export const getItems: GetItems<Value> = ({ v, state, device, editorMode }) => {
  const _isStory = isStory(editorMode);

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const type = dvv("type");
  const controls = dvv("controls");
  const hoverName = readString(dvv("hoverName")) ?? "none";

  const isCustomVideo = type === "custom";
  const isControlsEnabled = controls === "on";

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
                      id: "padding",
                      type: "padding",
                      label: t("Padding"),
                      disabled: true
                    },
                    {
                      id: "bgPadding",
                      type: "padding",
                      label: t("Padding"),
                      position: 50,
                      style: (d) =>
                        bgPaddingCSS({ isControlsEnabled, isCustomVideo }, d)
                    },
                    {
                      id: "border",
                      type: "corners",
                      label: t("Corner"),
                      devices: "desktop",
                      position: 65,
                      selector: "{{WRAPPER}} .brz-video-content"
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
                      disabled: _isStory,
                      devices: "desktop",
                      position: 100,
                      type: "slider",
                      config: {
                        min: 0,
                        max: 99,
                        units: [{ title: "ms", value: "ms" }]
                      },
                      style: transitionCSS
                    }
                  ]
                }
              ]
            },
            {
              id: "settingsTabsResponsive",
              type: "tabs",
              config: {
                align: "start"
              },
              devices: "responsive",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  icon: "nc-styling",
                  position: 10,
                  options: [
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
                      disabled: _isStory,
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
