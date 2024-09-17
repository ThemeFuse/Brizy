import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarVideoShopping",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Video")
      },
      options: [
        {
          id: "embedCode",
          label: t("Video Embed Code"),
          type: "inputText",
          placeholder: "<div class='myClass...'"
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
};
