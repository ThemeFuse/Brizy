import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      // @ts-expect-error: Type '"advancedSettings"' is not assignable to type
      type: "advancedSettings",
      devices: "desktop",
      position: 110
    }
  ];
};
