import type { ElementModel } from "visual/component/Elements/Types";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";

// @ts-expect-error "toggle" is old option
export const getItems: GetItems<ElementModel> = () => {
  return [
    {
      id: "list",
      type: "legacy-toggle",
      devices: "desktop",
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
