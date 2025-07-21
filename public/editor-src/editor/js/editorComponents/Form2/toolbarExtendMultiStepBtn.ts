import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { isStory } from "visual/providers/EditorModeProvider";
import { t } from "visual/utils/i18n";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({ editorMode }) => {
  const _isStory = isStory(editorMode);

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 20,
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Button"),
              options: [
                {
                  id: "msButtonsSpacing",
                  type: "slider",
                  label: t("Spacing"),
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
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
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      id: "multiStepBtnHorizontalAlign",
      position: 100,
      type: "toggle"
    },
    {
      type: "advancedSettings",
      id: "advancedSettings",
      disabled: _isStory
    }
  ];
};
