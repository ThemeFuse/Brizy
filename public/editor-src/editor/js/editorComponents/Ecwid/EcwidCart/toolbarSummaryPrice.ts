import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
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

  const summaryPriceColor = getColor(
    dvv("summaryPriceColorPalette"),
    dvv("summaryPriceColorHex"),
    dvv("summaryPriceColorOpacity")
  );

  return [
    {
      id: "toolbarTypographysummaryPrice",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "summaryPriceTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColorsummaryPrice",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: summaryPriceColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "summaryPriceColor",
          type: "colorPicker"
        }
      ]
    }
  ];
}
