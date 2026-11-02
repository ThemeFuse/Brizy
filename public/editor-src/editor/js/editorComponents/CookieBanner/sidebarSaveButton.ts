import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { buttonBorderRadiusCSS, buttonBorderRadiusTypeCSS } from "./css";
import type { Props, Value } from "./types";

export const title = (): string => t("Save Button");

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const radiusDisabled = dvv("saveButtonBorderRadiusType") !== "custom";

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
              id: "saveButtonRadiusGroup",
              type: "group",
              options: [
                {
                  id: "saveButtonBorderRadiusType",
                  label: t("Corner"),
                  type: "radioGroup",
                  choices: [
                    { value: "square", icon: "nc-corners-square" },
                    { value: "rounded", icon: "nc-corners-round" },
                    { value: "custom", icon: "nc-more" }
                  ],
                  style: buttonBorderRadiusTypeCSS("save")
                },
                {
                  id: "saveButtonBorderRadius",
                  type: "slider",
                  disabled: radiusDisabled,
                  config: {
                    min: 0,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  },
                  style: buttonBorderRadiusCSS("save")
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
