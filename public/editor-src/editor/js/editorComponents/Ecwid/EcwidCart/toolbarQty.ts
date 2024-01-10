import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export function getItems({
  v,
  device,
  state
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const { hex: qtyColorHex } = getOptionColorHexByPalette(
    dvv("qtyColorHex"),
    dvv("qtyColorPalette")
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
          id: "qtyTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColorqty",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(qtyColorHex, dvv("qtyColorOpacity"))
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "qtyColor",
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    }
  ];
}
