import { t } from "visual/utils/i18n";

export const title = () => t("Facebook");

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

export function getItems() {
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
                      id: "padding",
                      type: "padding",
                      label: t("Padding"),
                      disabled: true
                    },
                    {
                      id: "bgPadding",
                      type: "padding",
                      label: t("Padding"),
                      position: 50
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
                      type: "codeMirror",
                      position: 50,
                      display: "block",
                      devices: "desktop",
                      helper: { content: getHtml() },
                      placeholder: `element { ${t("CSS goes here")} }`
                    },
                    {
                      id: "hoverTransition",
                      label: t("Hover Transition"),
                      type: "slider",
                      devices: "desktop",
                      position: 100,
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
              id: "settingsTabsResponsive",
              type: "tabs",
              config: {
                align: "start"
              },
              devices: "responsive",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  position: 10,
                  options: [
                    {
                      id: "padding",
                      type: "padding",
                      label: t("Padding"),
                      devices: "responsive",
                      disabled: true
                    },
                    {
                      id: "bgPadding",
                      type: "padding",
                      label: t("Padding"),
                      devices: "responsive",
                      position: 50
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
