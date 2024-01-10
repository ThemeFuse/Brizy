import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarHextomReview",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Seals")
      },
      options: [
        {
          id: "badgeSeal",
          label: t("Seal Type"),
          type: "select",
          placeholder: t("Select Seal"),
          choices: [
            { title: "Seal", value: "htusb-placeholder-trust" },
            {
              title: "Advanced Seal",
              value: "htusb-placeholder-trust-advanced"
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      // @ts-expect-error: Old option
      type: "legacy-advancedSettings",
      devices: "desktop",
      sidebarLabel: t("More Settings"),
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
};
