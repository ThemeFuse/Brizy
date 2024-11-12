import { t } from "visual/utils/i18n";
import { GetItems } from "../EditorComponent/types";
import { Value } from "./toolbarExtend";

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
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      roles: ["admin"],
      position: 110,
      title: t("Settings")
    }
  ];
};
