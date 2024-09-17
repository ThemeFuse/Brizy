import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../../ToolbarItemType";

export function getItems(): ToolbarItemType[] {
  return [
    { id: "horizontalAlign", type: "toggle", disabled: true, choices: [] },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
