import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./index";

export const getItems = ({ v }: { v: Value }): ToolbarItemType[] => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device: "desktop", state: "normal" });
  const widgetType = dvv("widgetType");
  return [
    {
      id: "toolbarEmailMarketing",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Widgets")
      },
      options: [
        {
          id: "groupOptions",
          type: "group",
          options: [
            {
              id: "widgetType",
              label: t("Widget"),
              type: "select",
              placeholder: t("Select..."),
              choices: [
                { title: "Recent", value: "recent" },
                { title: "Summary", value: "summary" },
                { title: "Tab", value: "tab" },
                { title: "Badge", value: "badge" }
              ]
            },
            {
              id: "embededCode",
              label: t("Code"),
              type: "inputText",
              placeholder: "<div class='rf-feed...'",
              disabled: widgetType === ""
            }
          ]
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
