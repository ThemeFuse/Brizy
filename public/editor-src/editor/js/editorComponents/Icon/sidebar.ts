import { hasInfiniteAnimation } from "visual/component/HoverAnimation/utils";
import { hoverEffects } from "visual/component/Options/types/dev/Animation/utils";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { read as readString } from "visual/utils/string/specs";
import { GetItems } from "../EditorComponent/types";
import { Value } from "./index";

export const title = t("Icon");

export const getItems: GetItems<Value> = ({ v, device, context }) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const hoverName = readString(dvv("hoverName")) ?? "none";

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

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
              disabled: dvv("type") === "submit" || dvv("type") === "search",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic")
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  options: [
                    {
                      id: "cssID",
                      label: t("CSS ID"),
                      type: "population-dev",
                      position: 30,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content:
                          "Add your custom ID without the #pound, example: my-id"
                      },
                      config: richTextDC,
                      option: {
                        id: "customID",
                        type: "inputText-dev"
                      }
                    },
                    {
                      id: "cssClass",
                      label: t("CSS Class"),
                      type: "population-dev",
                      position: 40,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content:
                          "Add your custom class without the .dot, example: my-class"
                      },
                      config: richTextDC,
                      option: {
                        id: "customClassName",
                        type: "inputText-dev"
                      }
                    },
                    {
                      id: "hoverTransition",
                      label: t("Hover Transition"),
                      disabled: IS_STORY,
                      position: 100,
                      type: "slider-dev",
                      config: {
                        min: 0,
                        max: 99,
                        units: [{ title: "ms", value: "ms" }]
                      }
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
                  id: "tabHover",
                  label: t("Hover"),
                  options: [
                    {
                      id: "hover",
                      type: "animation-dev",
                      disabled: IS_STORY,
                      devices: "desktop",
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
