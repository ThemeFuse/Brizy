import { EditorComponentContextValue } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { EditorMode, isStory } from "visual/global/EditorModeContext";
import { t } from "visual/utils/i18n";
import { getDynamicContentOption } from "visual/utils/options";

export const title = () => t("Popup Close Icon");
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

export function getItems({
  context,
  editorMode
}: {
  context: EditorComponentContextValue;
  editorMode: EditorMode;
}): ToolbarItemType[] {
  const _isStory = isStory(editorMode);
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
                        id: "closeCustomID",
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
                        id: "closeCustomClassName",
                        type: "inputText"
                      }
                    },
                    {
                      id: "closeCustomAttributes",
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
                      id: "closeCustomCSS",
                      label: t("Custom CSS"),
                      type: "codeMirror",
                      position: 45,
                      display: "block",
                      devices: "desktop",
                      helper: { content: getHtml() },
                      placeholder: `element { ${t("CSS goes here")} }`
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
        }
      ]
    }
  ];
}
