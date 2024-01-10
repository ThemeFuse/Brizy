import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const { hex: taxesPriceColorHex } = getOptionColorHexByPalette(
    dvv("taxesPriceColorHex"),
    dvv("taxesPriceColorPalette")
  );

  return [
    {
      id: "toolbarTypographyTaxesPrice",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "taxesPriceTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColorTaxesPrice",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              taxesPriceColorHex,
              dvv("taxesPriceColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "taxesPriceColor",
          type: "colorPicker"
        }
      ]
    }
  ];
};
