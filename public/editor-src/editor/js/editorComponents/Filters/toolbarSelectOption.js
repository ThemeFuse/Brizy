import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: selectOptionColor } = getOptionColorHexByPalette(
    dvv("selectOptionColorrHex"),
    dvv("selectOptionColorPalette")
  );

  return [
    {
      id: "popoverColorSelectItem",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              selectOptionColor,
              v.selectOptionColorOpacity
            )
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBgSelectOption",
              label: t("Bg"),
              options: [
                {
                  id: "selectOptionBgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabTextSelectOption",
              label: t("Text"),
              options: [
                {
                  id: "selectOptionColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorderSelectOption",
              label: t("Border"),
              options: [
                {
                  id: "selectOptionBorder",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadowSelectOption",
              label: t("Shadow"),
              options: [
                {
                  id: "selectOptionBoxShadow",
                  type: "boxShadow-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypographySelectItem",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "selectOption",
          type: "typography-dev",
          config: {
            fontFamily: "desktop" === device
          }
        }
      ]
    },
    {
      id: "advancedSettingsselectItems",
      devices: "desktop",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
