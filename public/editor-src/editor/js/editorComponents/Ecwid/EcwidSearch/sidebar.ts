import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { containerSelector } from "./css/selectors";
import { Value } from "./types";

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
            devices: "desktop",
            config: {
              align: "start"
            },
            tabs: [
              {
                id: "settingsStyling",
                label: t("Basic"),
                options: [
                  {
                    id: "padding",
                    type: "padding",
                    devices: "desktop",
                    disabled: true
                  },
                  {
                    id: "parentPadding",
                    type: "padding",
                    label: t("Padding"),
                    position: 50,
                    selector: containerSelector
                  }
                ]
              }
            ]
          },
          {
            id: "settingsTabsResponsive",
            type: "tabs",
            config: {
              align: "start"
            },
            devices: "responsive",
            tabs: [
              {
                id: "settingsStyling",
                label: t("Basic"),
                position: 10,
                options: [
                  {
                    id: "padding",
                    type: "padding",
                    disabled: true
                  },
                  {
                    id: "parentPadding",
                    type: "padding",
                    label: t("Padding"),
                    position: 50,
                    selector: containerSelector
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
