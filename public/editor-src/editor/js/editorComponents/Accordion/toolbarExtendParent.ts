import { t } from "visual/utils/i18n";
import { GetItems } from "../EditorComponent/types";
import { Value } from "./toolbarExtend";

// @ts-expect-error "advancedSettings" is old option
export const getItems: GetItems<Value> = () => {
  return [
    {
      id: "toolbarAccordion",
      type: "popover",
      config: {
        icon: "nc-toggle",
        title: t("Accordion")
      },
      position: 80,
      options: [
        {
          id: "enableTags",
          label: t("Enable tags"),
          type: "switch",
          devices: "desktop"
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true
    },
    {
      id: "advancedSettings",
      type: "legacy-advancedSettings",
      sidebarLabel: t("More Settings"),
      devices: "desktop",
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
};
