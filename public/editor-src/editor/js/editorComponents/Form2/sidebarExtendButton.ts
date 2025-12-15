import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { getDynamicContentOption } from "visual/utils/options";
import type { GetItems } from "../EditorComponent/types";
import type { Value } from "./types";

const getHtml = () => {
  return `
<p class="brz-p">${t(
    "You can use the following selectors to create targeted CSS."
  )}</p>
<p class="brz-p">
  <span class="brz-span brz-ed-tooltip__overlay-code">element</span> {...}
  <br class="brz-br">
  <span class="brz-span brz-ed-tooltip__overlay-code">element .child-element</span> {...}
</p>`;
};

export const getItems: GetItems<Value> = ({ context }) => {
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
                  id: "moreSettingsAdvanced",
                  options: [
                    {
                      id: "customAttributes",
                      label: t("Custom Attributes"),
                      type: "codeMirror",
                      position: 45,
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
                      id: "customCSS",
                      label: t("Custom CSS"),
                      type: "codeMirror",
                      position: 45,
                      display: "block",
                      devices: "desktop",
                      helper: { content: getHtml() },
                      placeholder: `element { ${t("CSS goes here")} }`
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "effects",
          options: [
            {
              id: "tabs",
              type: "tabs",
              tabs: [
                {
                  id: "tabHover",
                  options: [
                    {
                      id: "hover",
                      type: "animation",
                      disabled: true
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
