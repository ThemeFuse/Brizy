import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const selectBgColor = getColor(
    dvv("selectColorPalette"),
    dvv("selectColorHex"),
    dvv("selectColorOpacity")
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
            backgroundColor: selectBgColor
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
