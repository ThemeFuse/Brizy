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

  const { hex: inputColorHex } = getOptionColorHexByPalette(
    dvv("inputColorHex"),
    dvv("inputColorPalette")
  );
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-form-left",
        title: t("Input")
      },
      position: 10,
      options: [
        {
          id: "inputHeight",
          type: "slider-dev",
          label: t("Height"),
          devices: "desktop",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 20,
      options: [
        {
          id: "input",
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
            backgroundColor: hexToRgba(inputColorHex, v.inputColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabInputColor",
              label: t("Color"),
              options: [
                {
                  id: "inputColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Bg"),
              options: [
                {
                  id: "inputBgColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "inputBorder",
                  type: "border-dev"
                }
              ]
            },
            {
              id: "boxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "inputBoxShadow",
                  type: "boxShadow-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      // @ts-expect-error old option
      type: "advancedSettings",
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
