import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
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

  const { hex: checkbox2BgColorHex } = getOptionColorHexByPalette(
    dvv("checkbox2BgColorHex"),
    dvv("checkbox2BgColorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      position: 10,
      config: {
        icon: "nc-check-square-on",
        title: t("Checkbox")
      },
      options: [
        {
          id: "columnGroup",
          type: "group-dev",
          options: [
            {
              id: "checkbox2ColumnSwitch",
              type: "switch-dev",
              label: t("Columns")
            },
            {
              id: "checkbox2Columns",
              label: t("Type"),
              disabled: dvv("checkbox2ColumnSwitch") === "off",
              type: "select-dev",
              choices: [
                { title: "1", value: 1 },
                { title: "2", value: 2 },
                { title: "3", value: 3 },
                { title: "4", value: 4 },
                { title: "5", value: 5 },
                { title: "6", value: 6 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover-dev",
      position: 20,
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      options: [
        {
          id: "tabsToolbarTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCheckbox2",
              label: t("Text"),
              options: [
                {
                  id: "checkbox2Typography",
                  type: "typography-dev",
                  config: { fontFamily: device === "desktop" }
                }
              ]
            },
            {
              id: "tabSurcharge",
              label: t("Surcharge"),
              options: [
                {
                  id: "surchargeTypography",
                  type: "typography-dev",
                  config: { fontFamily: device === "desktop" }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      position: 30,
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              checkbox2BgColorHex,
              dvv("checkbox2BgColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      options: [
        {
          id: "tabsToolbarColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "checkbox2Color",
              label: t("Text"),
              options: [
                {
                  id: "checkbox2BgColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "surchargeColor",
              label: t("Surcharge"),
              options: [
                {
                  id: "surchargeColor",
                  type: "colorPicker-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      position: 40,
      options: [
        {
          id: "checkbox2Spacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
}
