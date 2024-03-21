import { t } from "visual/utils/i18n";
import { GetItems } from "../EditorComponent/types";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = () => {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-share-2",
        title: t("Button")
      },
      position: 10,
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Content"),
              options: [
                {
                  id: "columns",
                  label: t("Columns"),
                  type: "select",
                  choices: [
                    { title: t("Auto"), value: "auto" },
                    { title: t("1"), value: "1" },
                    { title: t("2"), value: "2" },
                    { title: t("3"), value: "3" },
                    { title: t("4"), value: "4" },
                    { title: t("5"), value: "5" },
                    { title: t("6"), value: "6" }
                  ]
                },
                {
                  id: "columnsGap",
                  type: "slider",
                  label: t("Columns Gap"),
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "rowsGap",
                  type: "slider",
                  label: t("Rows Gap"),
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
