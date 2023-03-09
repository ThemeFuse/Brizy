import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarKlavyioMarketing",
      type: "popover-dev",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Marketing")
      },
      options: [
        {
          id: "formID",
          type: "inputText-dev",
          label: t("Embed Form Id"),
          placeholder: "Enter form code"
        }
      ]
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
