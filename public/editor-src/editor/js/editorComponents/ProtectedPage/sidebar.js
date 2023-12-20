import { t } from "visual/utils/i18n";

const helperHTML = `
<p class="brz-p">${t("You can use the following selectors to create targeted CSS.")}</p>
<p class="brz-p">
  <span class="brz-span brz-ed-tooltip__overlay-code">element</span> {...}
  <br class="brz-br">
  <span class="brz-span brz-ed-tooltip__overlay-code">element .child-element</span> {...}
</p>`;

export function getItems() {
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
    }
  ];
}
