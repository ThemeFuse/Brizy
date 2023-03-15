import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../ToolbarItemType";

export const sidebarParentPadding = (): ToolbarItemType[] => {
  return [
    {
      id: "padding",
      type: "padding-dev",
      label: t("Padding"),
      disabled: true
    },
    {
      id: "bgPadding",
      type: "padding-dev",
      label: t("Padding"),
      position: 50
    }
  ];
};

export const sidebarParentPaddingResponsive = (): ToolbarItemType[] => {
  return [
    {
      id: "padding",
      type: "padding-dev",
      label: t("Padding"),
      devices: "responsive",
      disabled: true
    },
    {
      id: "bgPadding",
      type: "padding-dev",
      label: t("Padding"),
      devices: "responsive",
      position: 50
    }
  ];
};
