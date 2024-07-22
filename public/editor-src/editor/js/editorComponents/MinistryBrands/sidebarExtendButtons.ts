import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";

export function getItems(): ToolbarItemType[] {
  return [
    {
      id: "moreSettingsAdvanced",
      label: t("Advanced"),
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "buttonsHoverTransition",
              label: t("Hover Transition"),
              disabled: isStory(Config.getAll()),
              devices: "desktop",
              position: 100,
              type: "slider",
              config: {
                min: 0,
                max: 99,
                units: [{ title: "ms", value: "ms" }]
              }
            }
          ]
        }
      ]
    }
  ];
}
