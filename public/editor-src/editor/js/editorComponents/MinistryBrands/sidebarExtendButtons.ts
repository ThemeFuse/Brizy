import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { WithEditorMode, isStory } from "visual/providers/EditorModeProvider";
import { t } from "visual/utils/i18n";

export function getItems({ editorMode }: WithEditorMode): ToolbarItemType[] {
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
              disabled: isStory(editorMode),
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
