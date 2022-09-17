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
      type: "popover-dev",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Widgets")
      },
      options: [
        {
          id: "groupOptions",
          type: "group-dev",
          options: [
            {
              id: "widgetType",
              label: t("Widget"),
              type: "select-dev",
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
              type: "inputText-dev",
              placeholder: "<div class='rf-feed...'",
              disabled: widgetType === ""
            }
          ]
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
