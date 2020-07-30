import { defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ACTIVE, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device, state }),
    defaultValueValue({ v, key: "bgColorPalette", device, state })
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-switcher",
        title: t("Switcher")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "switcherStyle",
          label: t("Style"),
          type: "radioGroup-dev",
          devices: "desktop",
          choices: [
            { value: "style-1", icon: "nc-switcher-style-1" },
            { value: "style-2", icon: "nc-switcher-style-2" }
          ]
        },
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
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
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
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(bgColorHex, v.bgColorOpacity)
          }
        }
      },
      devices: "desktop",
      roles: ["admin"],
      position: 90,
      options: [
        {
          id: "color",
          type: "tabs-dev",
          tabs: [
            {
              id: "bg",
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
              id: "text",
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
              id: "border",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev"
                }
              ]
            },
            {
              id: "shadow",
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
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
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
