import { t } from "visual/utils/i18n";

export const title = t("Excerpt");

const helperHTML = `
<p class="brz-p">You can use the following selectors to create targeted CSS.</p>
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
          options: []
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
              id: "tagName",
              label: t("HTML Tag"),
              type: "select-dev",
              choices: [
                { title: t("Span"), value: "span" },
                { title: t("P"), value: "p" },
                { title: t("H1"), value: "h1" },
                { title: t("H2"), value: "h2" },
                { title: t("H3"), value: "h3" },
                { title: t("H4"), value: "h4" },
                { title: t("H5"), value: "h5" },
                { title: t("H6"), value: "h6" },
                { title: t("PRE"), value: "pre" }
              ]
            }
          ]
        }
      ]
    }
  ];
}
