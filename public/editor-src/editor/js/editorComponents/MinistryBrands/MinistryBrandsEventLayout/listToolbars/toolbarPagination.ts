import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { NORMAL } from "visual/utils/stateMode";
import type { Props, Value } from "../types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const { hex: listPaginationColorHex } = getOptionColorHexByPalette(
    dvv("listPaginationColorHex"),
    dvv("listPaginationColorPalette")
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
          id: "listPaginationTypography",
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
            backgroundColor: hexToRgba(
              listPaginationColorHex,
              dvv("listPaginationColorOpacity")
            )
          }
        }
      },
      position: 80,
      options: [
        {
          id: "listPaginationColor",
          type: "colorPicker",
          states: [NORMAL]
        }
      ]
    },

    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "listPaginationSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
};
