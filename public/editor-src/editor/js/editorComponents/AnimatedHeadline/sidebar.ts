import type { ElementProps } from "visual/component/Elements/Types";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import type { GetItems } from "../EditorComponent/types";
import { transitionCSS } from "./css";
import type { Value } from "./types";

export const getItems: GetItems<Value, ElementProps> = ({ component }) => [
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
                    disabled: isStory(component.getGlobalConfig()),
                    devices: "desktop",
                    position: 100,
                    type: "slider",
                    config: {
                      min: 0,
                      max: 99,
                      units: [{ title: t("ms"), value: "ms" }]
                    },
                    style: transitionCSS
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
