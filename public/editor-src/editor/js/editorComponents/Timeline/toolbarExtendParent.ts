import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

export function getItems(): ToolbarItemType[] {
  return [
    { id: "horizontalAlign", type: "toggle-dev", disabled: true, choices: [] }
  ];
}
