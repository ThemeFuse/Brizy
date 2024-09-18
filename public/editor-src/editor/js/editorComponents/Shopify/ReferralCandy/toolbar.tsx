import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../../ToolbarItemType";

export function getItems(): ToolbarItemType[] {
  return [
    {
      id: "toolbarRefferalCandy",
      type: "popover",
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
          type: "inputText",
          placeholder: "Insert code here..."
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 110,
      title: t("Settings")
    }
  ];
}
