import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import type { Value } from "./types";

export const getItems: GetItems<Value> = () => {
  const IS_STORY = isStory(Config.getAll());

  return [
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      disabled: !IS_STORY,
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
      disabled: IS_STORY
    }
  ];
};
