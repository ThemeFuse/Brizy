import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { Value } from "./index";

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

  const { hex: title2ColorHex } = getOptionColorHexByPalette(
    dvv("title2ColorHex"),
    dvv("title2ColorPalette")
  );

  return [
    {
      id: "toolbarTypographyTitle2",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "title2",
          type: "typography-dev",
          config: {
            fontFamily: "desktop" === device
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(title2ColorHex, v.title2ColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "title2Color",
          type: "colorPicker-dev"
        }
      ]
    },
    {
      id: "title2HorizontalAlign",
      type: "toggle-dev",
      position: 30,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    }
  ];
}
