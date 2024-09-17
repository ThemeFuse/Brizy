import type { ElementProps } from "visual/component/Elements/Types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import type { GetItems } from "../EditorComponent/types";
import type { Value } from "./types";

export const getItems: GetItems<Value, ElementProps> = () => [
  {
    id: "sidebarTabs",
    type: "sidebarTabs",
    tabs: [
      {
        id: "styles",
        title: t("Styling"),
        label: t("Styling"),
        options: [
          {
            id: "settingsTabs",
            type: "tabs",
            config: {
              align: "start"
            },
            devices: "desktop",
            tabs: [
              {
                id: "settingsStyling",
                label: t("Basic"),
                options: [
                  {
                    id: "border",
                    type: "corners",
                    label: t("Corner"),
                    devices: "desktop",
                    position: 65
                  }
                ]
              },
              {
                id: "moreSettingsAdvanced",
                label: t("Advanced"),
                options: [
                  {
                    id: "hoverTransition",
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
        ]
      }
    ]
  }
];
