import type { ElementModel } from "visual/component/Elements/Types";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";

export const getItems: GetItems<ElementModel> = () => {
  return [
    {
      id: "list",
      type: "toggle",
      devices: "desktop",
      choices: [],
      disabled: true
    },
    {
      id: "toolbarSettings",
      type: "popover",
      options: [
        {
          id: "grid",
          type: "grid",
          disabled: true
        }
      ]
    }
  ];
};
