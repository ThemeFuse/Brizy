import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { Value } from "./index";

export const title = t("Icon");

export function getItems({
  v,
  device,
  context
}: {
  v: Value;
  device: ResponsiveMode;
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const richTextDC = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.richText
  );

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
                      config: { choices: richTextDC },
                      options: [
                        {
                          id: "customID",
                          type: "inputText-dev"
                        }
                      ]
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
                      config: { choices: richTextDC },
                      options: [
                        {
                          id: "customClassName",
                          type: "inputText-dev"
                        }
                      ]
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
        }
      ]
    }
  ];
}
