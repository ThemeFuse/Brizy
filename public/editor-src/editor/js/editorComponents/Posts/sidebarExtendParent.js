import { t } from "visual/utils/i18n";

export const title = ({ v }) => {
  switch (v.type) {
    case "posts":
      return t("Posts");
    case "archives":
      return t("Archive");
    case "products":
      return t("Products");
    case "archives-product":
      return t("Archive");
    case "upsell":
      return t("Upsell");
    default:
      throw new Error(`unknown Posts type ${v.type}`);
  }
};

const helperCustomCSS = `
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
              helper: { content: helperCustomCSS },
              placeholder: "element { CSS goes here }"
            }
          ]
        }
      ]
    }
  ];
}
