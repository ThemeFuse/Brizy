import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export const title = ({ v, device }) => {
  const dvv = (key) => defaultValueValue({ v, key, device });
  const type = dvv("type");

  switch (type) {
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
      throw new Error(`unknown Posts type ${type}`);
  }
};

const getHelperCustomCSS = () => `
<p class="brz-p">${t(
  "You can use the following selectors to create targeted CSS."
)}</p>
<p class="brz-p">
  <span class="brz-span brz-ed-tooltip__overlay-code">element</span> {...}
  <br class="brz-br">
  <span class="brz-span brz-ed-tooltip__overlay-code">element .child-element</span> {...}
</p>`;

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
                  icon: "nc-styling"
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  icon: "nc-cog",
                  options: [
                    {
                      id: "customCSS",
                      label: t("Custom CSS"),
                      type: "codeMirror",
                      position: 45,
                      display: "block",
                      devices: "desktop",
                      helper: { content: getHelperCustomCSS() },
                      placeholder: `element { ${t("CSS goes here")} }`
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
