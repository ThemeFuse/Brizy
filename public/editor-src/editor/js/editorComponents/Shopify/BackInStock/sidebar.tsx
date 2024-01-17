import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      devices: "desktop",
      tabs: []
    }
  ];
};
