import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

export function getItems(): ToolbarItemType[] {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      disabled: true,
      tabs: []
    }
  ];
}
