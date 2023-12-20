import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { getDynamicContentOption } from "visual/utils/options";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { ToolbarItemType } from "../ToolbarItemType";

export function getItems({
  context
}: {
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const toolbarTagsChoices = [
    { title: "Div", value: "div" },
    { title: t("Header"), value: "header" },
    { title: t("Footer"), value: "footer" },
    { title: t("Main"), value: "main" },
    { title: t("Article"), value: "article" },
    { title: t("Section"), value: "section" },
    { title: t("Aside"), value: "aside" },
    { title: t("Nav"), value: "nav" }
  ];
  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

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
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  options: [
                    {
                      id: "showOnDesktop",
                      label: t("Show on Desktop"),
                      position: 10,
                      type: "switch-dev",
                      devices: "desktop"
                    },
                    {
                      id: "margin",
                      label: t("Margin"),
                      type: "margin-dev",
                      position: 60
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  options: [
                    {
                      id: "zIndex",
                      type: "slider-dev",
                      position: 20,
                      label: t("Z-index"),
                      devices: "desktop",
                      config: {
                        min: 0,
                        max: 100
                      }
                    },
                    {
                      id: "cssID",
                      label: t("Block Name"),
                      type: "population-dev",
                      position: 40,
                      devices: "desktop",
                      display: "block",
                      helper: {
                        content: t("Add your custom block name, example: my-block"),
                      },
                      config: richTextDC,
                      option: {
                        id: "anchorName",
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
                          t("Add your custom class without the .dot, example: my-class")
                      },
                      config: richTextDC,
                      option: {
                        id: "customClassName",
                        type: "inputText-dev"
                      }
                    },
                    {
                      id: "customAttributes",
                      label: t("Custom Attributes"),
                      type: "codeMirror-dev",
                      position: 45,
                      // eslint-disable-next-line
                      placeholder: 'key1:"value1"\nkey2:"value2"',
                      display: "block",
                      devices: "desktop",
                      helper: {
                        content:
                          t("Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character."),
                      },
                      population: richTextDC
                    },
                    {
                      id: "tagName",
                      label: t("HTML Tag"),
                      type: "select-dev",
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
              type: "tabs-dev",
              config: { align: "start" },
              tabs: [
                {
                  id: "entrance",
                  label: t("Entrance"),
                  options: [
                    {
                      id: "animation",
                      type: "animation-dev"
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
