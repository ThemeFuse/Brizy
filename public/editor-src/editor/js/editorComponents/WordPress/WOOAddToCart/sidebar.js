import { t } from "visual/utils/i18n";
import { toolbarBorderRadius } from "visual/utils/toolbar";
export const title = t("Add To Cart");

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
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      devices: "desktop",
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          icon: "nc-styling",
          options: [
            toolbarBorderRadius({
              v,
              device,
              prefix: "button",
              state: "normal",
              devices: "desktop",
              position: 70,
              onChangeGrouped: ["onChangeBorderRadiusGrouped"],
              onChangeUngrouped: ["onChangeBorderRadiusUngrouped"]
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
    }
  ];
}
