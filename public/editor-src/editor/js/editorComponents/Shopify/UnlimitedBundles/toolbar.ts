import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarBundlesApp",
      type: "popover-dev",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Bundles App")
      },
      options: [
        {
          id: "embededCode",
          label: t("Embeded Code"),
          type: "inputText-dev",
          placeholder: "<div data-att.."
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      // @ts-expect-error: Old option
      type: "advancedSettings",
      devices: "desktop",
      sidebarLabel: t("More Settings"),
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
};
