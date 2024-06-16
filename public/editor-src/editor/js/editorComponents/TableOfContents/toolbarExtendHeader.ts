import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { Props, State, Value } from "./types";

//@ts-expect-error Old option "legacy-advancedSettings"
export const getItems: GetItems<Value, Props, State> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const { hex: headerBgHex } = getOptionColorHexByPalette(
    dvv("titleBgColorHex"),
    dvv("titleBgColorPalette")
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
      position: 10,
      options: [
        {
          id: "",
          type: "typography",
          config: {
            fontFamily: "desktop" === device
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      devices: "desktop",
      position: 20,
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(headerBgHex, v.titleBgColorOpacity)
          }
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabTitle",
              label: t("Title"),
              options: [
                {
                  id: "titleColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Background"),
              options: [
                {
                  id: "titleBgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "headerBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  config: {
                    styles: [
                      "none",
                      "solid",
                      "dashed",
                      "dotted",
                      "double",
                      "groove",
                      "ridge",
                      "inset",
                      "outset"
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "legacy-advancedSettings"
    }
  ];
};
