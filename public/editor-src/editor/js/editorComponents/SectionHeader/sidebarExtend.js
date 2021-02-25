import { t } from "visual/utils/i18n";
import { toolbarEntranceAnimation } from "visual/utils/toolbar";
import { getDynamicContentChoices } from "visual/utils/options";

export function getItems({ v, device }) {
  const toolbarTagsChoices = [
    { title: t("Div"), value: "div" },
    { title: t("Header"), value: "header" },
    { title: t("Footer"), value: "footer" },
    { title: t("Main"), value: "main" },
    { title: t("Article"), value: "article" },
    { title: t("Section"), value: "section" },
    { title: t("Aside"), value: "aside" },
    { title: t("Nav"), value: "nav" }
  ];

  const richTextDC = getDynamicContentChoices("richText", true);

  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      tabs: [
        {
          id: "moreSettingsAdvanced",
          label: t("Advanced"),
          icon: "nc-cog",
          options: [
            {
              id: "showOnDesktop",
              label: t("Show on Desktop"),
              position: 10,
              closeTooltip: true,
              type: "switch-dev",
              devices: "desktop"
            },
            {
              id: "cssID",
              label: t("Block Name"),
              type: "population-dev",
              position: 40,
              devices: "desktop",
              display: "block",
              helper: {
                content: "Add your custom block name, example: my-block"
              },
              config: {
                choices: richTextDC
              },
              options: [
                {
                  id: "anchorName",
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
              config: {
                choices: richTextDC
              },
              options: [
                {
                  id: "customClassName",
                  type: "inputText-dev"
                }
              ]
            },
            {
              id: "customAttributes",
              label: t("Custom Attributes"),
              type: "codeMirror-dev",
              position: 45,
              placeholder: "key1:value1\nkey2:value2",
              display: "block",
              devices: "desktop",
              helper: {
                content:
                  "Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character."
              },
              population: richTextDC
            },
            toolbarEntranceAnimation({
              v,
              device,
              state: "normal"
            }),
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
  ];
}
