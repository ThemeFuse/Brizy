import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { ViewType } from "visual/editorComponents/Form2/Form2Steps/types";
import { t } from "visual/utils/i18n";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({ v }) => {
  const { multistep, items } = v;

  return [
    { id: "horizontalAlign", type: "toggle", disabled: true, choices: [] },
    {
      id: "toolbarForm",
      type: "popover",
      disabled: items.length < 5,
      config: {
        icon: "nc-form-left",
        title: t("Step")
      },
      position: 10,
      options: [
        {
          id: "multistep",
          type: "switch",
          label: t("Multi Step"),
          devices: "desktop"
        },
        {
          id: "viewType",
          type: "select",
          label: t("Type"),
          devices: "desktop",
          disabled: multistep === "off",
          choices: [
            { value: ViewType.None, title: "None" },
            { value: ViewType.Text, title: "Text" },
            { value: ViewType.Icon, title: "Icon" },
            { value: ViewType.Number, title: "Number" },
            { value: ViewType.Progress, title: "Progress Bar" },
            { value: ViewType.NumberText, title: "Number & Text" },
            { value: ViewType.IconText, title: "Icon & Text" }
          ]
        }
      ]
    }
  ];
};
