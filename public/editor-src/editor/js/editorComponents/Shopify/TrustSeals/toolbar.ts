import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      // @ts-expect-error: Type '"advancedSettings"' is not assignable to type
      type: "legacy-advancedSettings",
      devices: "desktop",
      position: 110
    }
  ];
};
