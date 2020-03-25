import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  toolbarElementCounterStyles,
  toolbarElementCounterStart,
  toolbarElementCounterEnd
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      devices: "desktop",
      icon: "nc-counter-outline",
      title: t("Counter"),
      position: 70,
      options: [
        toolbarElementCounterStyles({
          v,
          device,
          devices: "desktop",
          state: "normal"
        }),
        toolbarElementCounterStart({
          v,
          device,
          devices: "desktop",
          state: "normal",
          disabled: v.type !== "simple"
        }),
        toolbarElementCounterEnd({
          v,
          device,
          devices: "desktop",
          state: "normal"
        }),
        {
          id: "strokeWidth",
          label: t("Width"),
          type: "slider-dev",
          disabled: v.type === "simple" || v.type === "pie",
          config: {
            min: 1,
            max: 32
          }
        },
        {
          id: "duration",
          label: t("Duration"),
          type: "slider-dev",
          config: {
            min: 0,
            step: 0.2,
            max: 10,
            units: [{ value: "sec", title: "sec" }]
          }
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      disabled: v.type === "empty" || v.type === "pie",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "popoverColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(colorHex, v.colorOpacity)
        }
      },
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
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER],
                  disabled: v.type === "empty" || v.type === "pie"
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "fillColor",
                  type: "colorPicker-dev",
                  disabled: v.type === "simple",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBgProgress",
              label: t("Progress"),
              options: [
                {
                  id: "strokeColor",
                  type: "colorPicker-dev",
                  disabled: v.type === "simple",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      disabled: v.type === "simple",
      options: [
        {
          id: "width",
          label: t("Size"),
          type: "slider-dev",
          disabled: v.type === "simple",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      position: 110,
      disabled: v.type !== "simple",
      title: t("Settings"),
      roles: ["admin"],
      icon: "nc-cog"
    }
  ];
}
