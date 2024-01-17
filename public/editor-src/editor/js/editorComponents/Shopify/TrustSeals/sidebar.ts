import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { ResponsiveMode } from "visual/utils/responsiveMode";

export const getItems = ({
  device
}: {
  device: ResponsiveMode;
}): ToolbarItemType[] => {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      disabled: device !== "desktop",
      tabs: []
    }
  ];
};
