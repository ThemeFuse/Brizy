import { t } from "visual/utils/i18n";
import { toolbarElementCarouselPadding } from "visual/utils/toolbar";

export const title = t("Carousel");

const helperHTML = `
<p class="brz-p">You can use the following selectors to create targeted CSS.</p>
<p class="brz-p">
  <span class="brz-span brz-ed-tooltip__overlay-code">element</span> {...}
  <br class="brz-br">
  <span class="brz-span brz-ed-tooltip__overlay-code">element .child-element</span> {...}
</p>`;

export function getItems({ v, device }) {
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
              id: "padding",
              type: "padding-dev",
              disabled: true
            },
            toolbarElementCarouselPadding({
              v,
              device,
              devices: "responsive",
              state: "normal"
            }),
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
                  icon: "nc-styling",
                  position: 10,
                  options: [
                    {
                      id: "padding",
                      type: "padding-dev",
                      disabled: true
                    },
                    toolbarElementCarouselPadding({
                      v,
                      device,
                      devices: "desktop",
                      state: "normal"
                    })
                  ]
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  icon: "nc-cog",
                  options: [
                    {
                      id: "customCSS",
                      label: t("Custom CSS"),
                      type: "codeMirror-dev",
                      position: 45,
                      display: "block",
                      devices: "desktop",
                      helper: { content: helperHTML },
                      placeholder: "element { CSS goes here }"
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
