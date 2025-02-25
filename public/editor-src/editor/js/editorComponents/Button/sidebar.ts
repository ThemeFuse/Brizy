import { hasInfiniteAnimation } from "visual/component/HoverAnimation/utils";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isStory } from "visual/providers/EditorModeProvider";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { buttonHoverEffects } from "visual/utils/options/Animation/utils";
import { read as readString } from "visual/utils/string/specs";
import { Props, Value } from "./types";
import { isButtonFillHover } from "./utils";

export const title = () => t("Button");

export const getItems: GetItems<Value, Props> = ({
  v,
  context,
  device,
  editorMode
}) => {
  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const type = dvv("type");

  const _isStory = isStory(editorMode);
  const hoverName = readString(dvv("hoverName")) ?? "none";
  const maxAnimationDuration = isButtonFillHover(hoverName) ? 1.0 : undefined;
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
              disabled: type === "search",
              tabs: [
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  icon: "nc-cog",
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
                  position: 100,
                  options: [
                    {
                      id: "hover",
                      type: "animation",
                      disabled: _isStory,
                      devices: "desktop",
                      config: {
                        types: buttonHoverEffects,
                        replay: false,
                        maxDuration: maxAnimationDuration,
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
