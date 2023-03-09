import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarFeraReview",
      type: "popover-dev",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Badge")
      },
      options: [
        {
          id: "embededCode",
          label: t("Trusted's embed code"),
          type: "inputText-dev",
          placeholder: "<div class='trusted-...'"
        }
      ]
    },
    { id: "horizontalAlign", type: "toggle-dev", disabled: true, choices: [] },
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
