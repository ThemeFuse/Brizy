import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("arrowColorHex"),
    dvv("arrowColorPalette")
  );

  return [
    {
      id: "toolbarArrow",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Arrow")
      },
      position: 10,
      options: [
        {
          id: "sizeGroup",
          type: "group-dev",
          options: [
            {
              id: "arrowIconSize",
              label: t("Size"),
              type: "radioGroup-dev",
              choices: [
                { value: "small", icon: "nc-16" },
                { value: "medium", icon: "nc-24" },
                { value: "large", icon: "nc-32" },
                { value: "custom", icon: "nc-more" }
              ]
            },
            {
              id: "arrowIconCustomSize",
              type: "slider-dev",
              disabled: dvv("arrowIconSize") !== "custom",
              config: {
                min: 1,
                max: 100,
                units: [{ title: "px", value: "px" }]
              }
            }
          ]
        },
        {
          id: "arrowPosition",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ title: "px", value: "px" }]
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
            backgroundColor: hexToRgba(colorHex, dvv("arrowColorOpacity"))
          }
        }
      },
      position: 20,
      options: [
        {
          id: "arrowColor",
          type: "colorPicker-dev",
          states: [NORMAL, HOVER]
        }
      ]
    }
  ];
};
