import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { qtyMinMaxSelector } from "./css/selectors";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const qtyMinMaxColor = getColorToolbar(
    dvv("qtyMinMaxColorPalette"),
    dvv("qtyMinMaxColorHex"),
    dvv("qtyMinMaxColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyqty",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "qtyMinMaxTypography",
          type: "typography",
          selector: qtyMinMaxSelector,
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColorqtyMinMax",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: qtyMinMaxColor
          }
        }
      },
      position: 20,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "qtyMinMaxColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: qtyMinMaxSelector
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "qtyMinMaxTextShadow",
                  type: "textShadow",
                  selector: qtyMinMaxSelector,
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
