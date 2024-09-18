import type { ElementModel } from "visual/component/Elements/Types";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import type { Props } from "./types";

export const getItems: GetItems<ElementModel, Props> = ({ v }) => {
  const { viewType } = v;

  const isProgressViewType = viewType === "progressBar";

  return [
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
              tabs: [
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  options: [
                    {
                      id: "stepPadding",
                      label: t("Padding"),
                      position: 50,
                      type: "padding",
                      disabled: isProgressViewType
                    },
                    {
                      id: "border",
                      type: "corners",
                      label: t("Corner"),
                      position: 65,
                      disabled: isProgressViewType
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
};
