import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../../ToolbarItemType";

export function getItems(): ToolbarItemType[] {
  return [
    {
      id: "toolbarRefferalCandy",
      type: "popover-dev",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Referral")
      },
      options: [
        {
          id: "embedCode",
          label: t("Embed Code"),
          type: "inputText-dev",
          placeholder: "Insert code here..."
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
}
