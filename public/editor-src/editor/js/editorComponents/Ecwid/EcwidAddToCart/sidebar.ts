import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { buttonSelector } from "./css";
import type { Value } from "./types";

export const getItems: GetItems<Value> = () => [
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
                id: "moreSettingsAdvanced",
                label: t("Advanced"),
                options: [
                  {
                    id: "hoverTransition",
                    label: t("Hover Transition"),
                    devices: "desktop",
                    position: 100,
                    type: "slider",
                    config: {
                      min: 0,
                      max: 99,
                      units: [{ title: "ms", value: "ms" }]
                    },
                    selector: buttonSelector
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
