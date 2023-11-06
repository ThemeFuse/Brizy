import type { ElementModel } from "visual/component/Elements/Types";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";

// @ts-expect-error "toggle" is old option
export const getItems: GetItems<ElementModel> = () => {
  return [
    {
      id: "list",
      type: "toggle",
      devices: "desktop",
      disabled: true
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      options: [
        {
          id: "grid",
          type: "grid-dev",
          disabled: true
        }
      ]
    }
  ];
};
