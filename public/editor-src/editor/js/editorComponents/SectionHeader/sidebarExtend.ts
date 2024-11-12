import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { getDynamicContentOption } from "visual/utils/options";
import { Value, Props } from "./type";
import { toolbarTagsChoices } from "./utils";

export const getItems: GetItems<Value, Props> = ({ context }) => {
  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

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
                      id: "showOnDesktop",
                      label: t("Show on Desktop"),
                      position: 10,
                      closeTooltip: true,
                      type: "switch",
                      devices: "desktop"
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  icon: "nc-cog",
                  options: [
                    {
                      id: "cssID",
                      label: t("Block Name"),
                      type: "population",
                      position: 40,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content: t(
                          "Add your custom block name, example: my-block"
                        )
                      },
                      config: richTextDC,
                      option: {
                        id: "anchorName",
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
                      id: "customAttributes",
                      label: t("Custom Attributes"),
                      type: "codeMirror",
                      position: 45,
                      // eslint-disable-next-line
                      placeholder: 'key1:"value1"\nkey2:"value2"',
                      display: "block",
                      devices: "desktop",
                      helper: {
                        content: t(
                          "Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character."
                        )
                      },
                      population: richTextDC
                    },
                    {
                      id: "tagName",
                      label: t("HTML Tag"),
                      type: "select",
                      devices: "desktop",
                      choices: toolbarTagsChoices
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
                  options: [
                    {
                      id: "animation",
                      type: "animation"
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
