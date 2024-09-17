import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarFeraReview",
      type: "popover",
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
          type: "inputText",
          placeholder: "<div class='trusted-...'"
        }
      ]
    },
    { id: "horizontalAlign", type: "toggle", disabled: true, choices: [] },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 110,
      title: t("Settings")
    }
  ];
};
