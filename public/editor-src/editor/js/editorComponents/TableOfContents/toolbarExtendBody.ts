import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { Props, State, Value } from "./types";

export const getItems: GetItems<Value, Props, State> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const { hex: bodyBgHex } = getOptionColorHexByPalette(
    dvv("bodyBgColorHex"),
    dvv("bodyBgColorPalette")
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
          id: "body",
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
      position: 20,
      devices: "desktop",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(bodyBgHex, v.bodyBgColorOpacity)
          }
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBody",
              label: t("Text"),
              options: [
                {
                  id: "bodyColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabMarker",
              label: t("Marker"),
              options: [
                {
                  id: "markerColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings"
    }
  ];
};
