import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarBundlesApp",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Widgets")
      },
      options: [
        {
          id: "widgetType",
          label: t("Widget Type"),
          type: "select",
          placeholder: t("Select"),
          choices: [
            { title: "Combo Product", value: "combo" },
            { title: "Bundles", value: "bundle" },
            { title: "Bundle Builders", value: "builder" },
            { title: "Kits", value: "kit" },
            { title: "Buy The Looks", value: "buy-the-look" }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 110,
      title: t("Settings")
    }
  ];
};
