import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const { hex: paginationColorHex } = getOptionColorHexByPalette(
    dvv("paginationColorHex"),
    dvv("paginationColorPalette")
  );

  return [
    {
      id: "toolbarTypography",
      type: "popover-dev",
      position: 70,
      roles: ["admin"],
      config: {
        title: t("Typography"),
        size: device === "desktop" ? "large" : "auto",
        icon: "nc-font"
      },
      options: [
        {
          id: "pagination",
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
        title: t("Colors"),
        size: "auto",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              paginationColorHex,
              dvv("paginationColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "paginationBgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "paginationColor",
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
                  id: "paginationBorder",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      icon: "nc-cog",
      position: 110,
      roles: ["admin"],
      title: t("Settings")
    }
  ];
}
