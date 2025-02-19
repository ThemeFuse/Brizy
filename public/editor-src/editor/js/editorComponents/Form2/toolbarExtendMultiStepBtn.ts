import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { isStory } from "visual/providers/EditorModeProvider";
import { t } from "visual/utils/i18n";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({ editorMode }) => {
  const _isStory = isStory(editorMode);

  return [
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      disabled: !_isStory,
      options: [
        {
          id: "submitHeight",
          label: t("Height"),
          type: "slider",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "styles",
          type: "sidebarTabsButton",
          devices: "desktop",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    },
    {
      id: "toolbarLink",
      type: "popover",
      disabled: true
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: _isStory
    }
  ];
};
