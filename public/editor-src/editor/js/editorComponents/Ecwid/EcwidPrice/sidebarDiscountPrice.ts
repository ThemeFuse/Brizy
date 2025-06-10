import { hasInfiniteAnimation } from "visual/component/HoverAnimation/utils";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { hoverEffects } from "visual/utils/options/Animation/utils";
import { read as readString } from "visual/utils/string/specs";
import { discountedPriceSelector, priceSelector } from "./css";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state, component }) => {
  const IS_STORY = isStory(component.getGlobalConfig());

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
                      id: "priceThroughBorder",
                      type: "corners",
                      label: t("Corner"),
                      position: 65,
                      selector: discountedPriceSelector
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
                      type: "slider",
                      config: {
                        min: 0,
                        max: 99,
                        units: [{ title: "ms", value: "ms" }]
                      },
                      selector: `${priceSelector}, ${discountedPriceSelector}`
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
