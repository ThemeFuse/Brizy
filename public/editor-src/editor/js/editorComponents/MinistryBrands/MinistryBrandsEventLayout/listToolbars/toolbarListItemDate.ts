import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { Props, Value } from "../types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const listItemDateColor = getColor(
    dvv("listItemDateColorPalette"),
    dvv("listItemDateColorHex"),
    dvv("listItemDateColorOpacity")
  );

  return [
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "listItemDateTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      devices: "desktop",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: listItemDateColor
          }
        }
      },
      position: 80,
      options: [
        {
          id: "colorTabs",
          type: "tabs",
          tabs: [
            {
              id: "tabColor",
              label: t("Text"),
              options: [
                {
                  id: "listItemDateColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Background"),
              options: [
                {
                  id: "listItemDate",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
