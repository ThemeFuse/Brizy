import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../../ToolbarItemType";

export function getItems(): ToolbarItemType[] {
  return [
    { id: "horizontalAlign", type: "toggle-dev", disabled: true, choices: [] },
    {
      id: "advancedSettings",
      //@ts-expect-error Old type
      type: "advancedSettings",
      devices: "desktop",
      sidebarLabel: t("More Settings"),
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
