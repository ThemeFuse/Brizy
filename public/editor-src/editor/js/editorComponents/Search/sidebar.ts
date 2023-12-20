import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../ToolbarItemType";

export const title = t("Search");

const helperHTML = `
<p class="brz-p">${t("You can use the following selectors to create targeted CSS.")}</p>
<p class="brz-p">
  <span class="brz-span brz-ed-tooltip__overlay-code">element</span> {...}
  <br class="brz-br">
  <span class="brz-span brz-ed-tooltip__overlay-code">element .child-element</span> {...}
</p>`;

export function getItems(): ToolbarItemType[] {
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
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  options: [
                    {
                      id: "padding",
                      type: "padding-dev",
                      label: t("Padding"),
                      disabled: true
                    },
                    {
                      id: "bgPadding",
                      type: "padding-dev",
                      label: t("Padding"),
                      position: 50
                    },
                    {
                      id: "border",
                      type: "corners-dev",
                      label: t("Corner"),
                      position: 65
                    }
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  options: [
                    {
                      id: "customCSS",
                      label: t("Custom CSS"),
                      type: "codeMirror-dev",
                      position: 45,
                      display: "block",
                      devices: "desktop",
                      helper: { content: helperHTML },
                      placeholder: `element { ${t("CSS goes here")} }`
                    },
                    {
                      id: "hoverTransition",
                      label: t("Hover Transition"),
                      devices: "desktop",
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
            },
            {
              id: "padding",
              type: "padding-dev",
              label: t("Padding"),
              devices: "responsive",
              disabled: true
            },
            {
              id: "bgPadding",
              type: "padding-dev",
              label: t("Padding"),
              devices: "responsive",
              position: 50
            }
          ]
        }
      ]
    }
  ];
}
