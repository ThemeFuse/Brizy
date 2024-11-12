import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { Value, Props } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state: "normal" });
  const { hex: selectBgColorHex } = getOptionColorHexByPalette(
    dvv("selectColorHex"),
    dvv("selectColorPalette")
  );

  return [
    {
      id: "toolbarColorSelect",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              selectBgColorHex,
              dvv("selectBgColorOpacity")
            )
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsSelectColor",
          type: "tabs",
          tabs: [
            {
              id: "tabSelectText",
              label: t("Text"),
              options: [
                {
                  id: "selectColor",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "tabSelectBg",
              label: t("Bg"),
              options: [
                {
                  id: "selectBgColor",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "tabSelectBorder",
              label: t("Border"),
              options: [
                {
                  id: "selectBorder",
                  type: "border",
                  config: {
                    width: ["grouped"]
                  }
                }
              ]
            },
            {
              id: "tabSelectBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "selectBoxShadow",
                  type: "boxShadow"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
