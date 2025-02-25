import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const color = getColorToolbar(
    dvv("arrowColorPalette"),
    dvv("arrowColorHex"),
    dvv("arrowColorOpacity")
  );

  return [
    {
      id: "toolbarArrow",
      type: "popover",
      config: {
        icon: "nc-star",
        title: t("Arrow")
      },
      position: 10,
      options: [
        {
          id: "sizeGroup",
          type: "group",
          options: [
            {
              id: "arrowIconSize",
              label: t("Size"),
              type: "radioGroup",
              choices: [
                { value: "small", icon: "nc-16" },
                { value: "medium", icon: "nc-24" },
                { value: "large", icon: "nc-32" },
                { value: "custom", icon: "nc-more" }
              ]
            },
            {
              id: "arrowIconCustomSize",
              type: "slider",
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
          type: "slider",
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
      type: "popover",
      devices: "desktop",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: color
          }
        }
      },
      position: 20,
      options: [
        {
          id: "arrowColor",
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    }
  ];
};
