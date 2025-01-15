import { hasInfiniteAnimation } from "visual/component/HoverAnimation/utils";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isStory } from "visual/global/EditorModeContext";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { hoverEffects } from "visual/utils/options/Animation/utils";
import { read as readString } from "visual/utils/string/specs";
import { GetItems } from "../EditorComponent/types";
import { Props, Value } from "./types";

export const title = () => t("Icon");

export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  context,
  editorMode
}) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const hoverName = readString(dvv("hoverName")) ?? "none";

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  const _isStory = isStory(editorMode);

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
                      id: "showOnDesktop",
                      label: t("Show on Desktop"),
                      type: "switch",
                      disabled: _isStory,
                      position: 10,
                      closeTooltip: true,
                      devices: "desktop"
                    },
                    {
                      id: "cssID",
                      label: t("CSS ID"),
                      type: "population",
                      position: 30,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content: t(
                          "Add your custom ID without the #pound, example: my-id"
                        )
                      },
                      config: richTextDC,
                      option: {
                        id: "customID",
                        type: "inputText"
                      }
                    },
                    {
                      id: "cssClass",
                      label: t("CSS Class"),
                      type: "population",
                      position: 40,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content: t(
                          "Add your custom class without the .dot, example: my-class"
                        )
                      },
                      config: richTextDC,
                      option: {
                        id: "customClassName",
                        type: "inputText"
                      }
                    },
                    {
                      id: "hoverTransition",
                      label: t("Hover Transition"),
                      disabled: _isStory,
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
                  id: "tabHover",
                  label: t("Hover"),
                  options: [
                    {
                      id: "hover",
                      type: "animation",
                      disabled: _isStory,
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
