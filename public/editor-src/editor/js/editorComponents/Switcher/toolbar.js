import { defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ACTIVE, NORMAL } from "visual/utils/stateMode";
import { toolbarElementSwitcherStyle } from "visual/utils/toolbar/toolbarElementSwitcher";

export function getItems({ v, device, state }) {
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device, state }),
    defaultValueValue({ v, key: "bgColorPalette", device, state })
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      devices: "desktop",
      icon: "nc-switcher",
      title: t("Switcher"),
      position: 70,
      options: [
        toolbarElementSwitcherStyle({
          v,
          device,
          devices: "desktop",
          state: "normal"
        }),
        {
          id: "spacing",
          type: "slider-dev",
          label: t("Spacing"),
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
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "typography",
          type: "typography-dev",
          config: {
            fontFamily: "desktop" === device
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      devices: "desktop",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, v.bgColorOpacity)
        }
      },
      options: [
        {
          id: "color",
          type: "tabs",
          tabs: [
            {
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, ACTIVE]
                }
              ]
            },
            {
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, ACTIVE]
                }
              ]
            },
            {
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev"
                }
              ]
            },
            {
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev"
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
      position: 110,
      options: [
        {
          id: "navStyle2Size",
          label: t("Size"),
          type: "slider-dev",
          disabled: v.switcherStyle === "style-1",
          devices: "desktop",
          config: {
            min: 25,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "navStyle1Width",
          label: t("Width"),
          type: "slider-dev",
          disabled: v.switcherStyle === "style-2",
          config: {
            min: 0,
            max: 1000,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          devices: "desktop"
        }
      ]
    }
  ];
}
