import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { NORMAL, HOVER } from "visual/utils/stateMode";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import {
  toolbarElementForm2BorderRadius,
  toolbarElementForm2Size,
  toolbarElementLoginSpacingPx
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-form-left",
        title: t("Field")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElementFields",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabsCurrentElementField",
              label: t("Field"),
              options: [
                toolbarElementForm2Size({
                  v,
                  device
                }),
                toolbarElementForm2BorderRadius({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop",
                  onChange: [
                    "onChangeBorderRadiusGrouped",
                    "onChangeBorderRadiusGroupedDependencies"
                  ]
                }),
                toolbarElementLoginSpacingPx({ v, device, state: "normal" })
              ]
            },
            {
              id: "tabsCurrentElementAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "showLabel",
                  label: t("Label"),
                  devices: "desktop",
                  type: "switch-dev"
                },
                {
                  id: "showPlaceholder",
                  label: t("Placeholder"),
                  devices: "desktop",
                  type: "switch-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabsTypographyInput",
              label: t("Text"),
              options: [
                {
                  id: "",
                  type: "typography-dev",
                  config: {
                    fontFamily: "desktop" === device
                  }
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
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              v.bgColorOpacity > 0
                ? hexToRgba(borderColorHex, v.borderColorOpacity)
                : hexToRgba(bgColorHex, v.bgColorOpacity)
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabInput",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
