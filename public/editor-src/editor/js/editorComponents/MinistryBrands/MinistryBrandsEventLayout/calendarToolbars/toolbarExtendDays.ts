import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { Value, Props } from "../types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const { hex: calendarDaysColorHex } = getOptionColorHexByPalette(
    dvv("calendarDaysColorHex"),
    dvv("calendarDaysColorPalette")
  );
  return [
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "calendarDaysTypography",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      devices: "desktop",
      config: {
        title: t("Colors"),
        size: "auto",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              calendarDaysColorHex,
              dvv("calendarDaysColorOpacity")
            )
          }
        }
      },
      position: 80,
      options: [
        {
          id: "colorTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabColor",
              label: t("Text"),
              options: [
                {
                  id: "calendarDaysColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "calendarDays",
                  type: "backgroundColor-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "calendarDaysBorder",
                  type: "border-dev",
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
