import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { Patch, Value } from "./types";
import { handleChangeTooltip } from "./utils/dependencies";

type OnChangeCallback = (value: Patch) => void;

const getItems =
  (onChange: OnChangeCallback): GetItems<Value> =>
  ({ v }) => {
    const dependencies = (data: Value) =>
      v.textPopulation ? data : onChange(handleChangeTooltip(data, v));

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
                devices: "desktop",
                tabs: [
                  {
                    id: "settingsStyling",
                    label: t("Basic"),
                    options: [
                      {
                        id: "tooltipPadding",
                        type: "padding",
                        label: t("Padding"),
                        dependencies
                      },
                      {
                        id: "tooltipBorder",
                        label: t("Corner"),
                        type: "corners",
                        dependencies
                      },
                      {
                        id: "tooltipPlacement",
                        label: t("Placement"),
                        type: "select",
                        choices: [
                          { value: "top", title: t("Top") },
                          { value: "top-start", title: t("Top Start") },
                          { value: "top-end", title: t("Top End") },
                          { value: "bottom", title: t("Bottom") },
                          { value: "bottom-start", title: t("Bottom Start") },
                          { value: "bottom-end", title: t("Bottom End") },
                          { value: "left", title: t("Left") },
                          { value: "left-start", title: t("Left Start") },
                          { value: "left-end", title: t("Left End") },
                          { value: "right", title: t("Right") },
                          { value: "right-start", title: t("Right Start") },
                          { value: "right-end", title: t("Right End") }
                        ],
                        dependencies
                      }
                    ]
                  },
                  {
                    id: "moreSettingsAdvanced",
                    label: t("Advanced"),
                    options: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  };

export default function (onChange: OnChangeCallback) {
  return { getItems: getItems(onChange) };
}
