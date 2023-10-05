import { t } from "visual/utils/i18n";
import { GetItems } from "../EditorComponent/types";
import { Value } from "./toolbarExtend";

export const title = t("Carousel");

const helperHTML = `
<p class="brz-p">You can use the following selectors to create targeted CSS.</p>
<p class="brz-p">
  <span class="brz-span brz-ed-tooltip__overlay-code">element</span> {...}
  <br class="brz-br">
  <span class="brz-span brz-ed-tooltip__overlay-code">element .child-element</span> {...}
</p>`;

export const getItems: GetItems<Value> = () => {
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
            {
              id: "sliderPadding",
              type: "padding-dev",
              label: t("Padding"),
              devices: "responsive",
              position: 50
            },
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
                  position: 10,
                  options: [
                    {
                      id: "padding",
                      type: "padding-dev",
                      disabled: true
                    },
                    {
                      id: "sliderPadding",
                      type: "padding-dev",
                      label: t("Padding"),
                      devices: "desktop",
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
};
