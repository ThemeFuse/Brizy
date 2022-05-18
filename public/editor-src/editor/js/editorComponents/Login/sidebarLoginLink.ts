import { ToolbarItemType } from "../ToolbarItemType";

export function getItems(): ToolbarItemType[] {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs-dev",
      disabled: true,
      tabs: []
    }
  ];
}
