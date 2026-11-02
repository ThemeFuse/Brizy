import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { buttonBorderRadiusCSS, buttonBorderRadiusTypeCSS } from "./css";
import type { Props, Value } from "./types";

export const title = (): string => t("Reject Button");

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const radiusDisabled = dvv("rejectButtonBorderRadiusType") !== "custom";

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
              id: "rejectButtonRadiusGroup",
              type: "group",
              options: [
                {
                  id: "rejectButtonBorderRadiusType",
                  label: t("Corner"),
                  type: "radioGroup",
                  choices: [
                    { value: "square", icon: "nc-corners-square" },
                    { value: "rounded", icon: "nc-corners-round" },
                    { value: "custom", icon: "nc-more" }
                  ],
                  style: buttonBorderRadiusTypeCSS("reject")
                },
                {
                  id: "rejectButtonBorderRadius",
                  type: "slider",
                  disabled: radiusDisabled,
                  config: {
                    min: 0,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  },
                  style: buttonBorderRadiusCSS("reject")
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
