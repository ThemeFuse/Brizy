import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { makeAttr } from "visual/utils/i18n/attribute";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarBundlesApp",
      type: "popover",
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
          type: "inputText",
          placeholder: `<div ${makeAttr("att..")}`
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
