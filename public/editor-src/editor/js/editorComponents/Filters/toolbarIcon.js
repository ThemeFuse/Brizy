import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";
import { HOVER, NORMAL, ACTIVE } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: checkIconColor } = getOptionColorHexByPalette(
    dvv("checkIconColorHex"),
    dvv("checkIconColorPalette")
  );

  const dataSourceManual = v.dataSource === "manual";
  const style4 = v.checkboxType === "style-4";
  const style3 = v.checkboxType === "style-3";
  const style1 = v.checkboxType === "style-1";
  const isActive = v.filterType === "active";

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-filters",
        title: t("Filter")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "itemsTabs",
          type: "tabs",
          tabs: [
            {
              id: "item",
              label: "Items",
              position: 40,
              options: [
                {
                  id: "spacing",
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
          ]
        }
      ]
    },
    {
      id: "popoverColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(checkIconColor, v.checkIconColorOpacity)
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
              id: "tabCheckIconColor",
              label: t(isActive ? "Color" : "Bg"),
              options: [
                {
                  id: "checkIconColor",
                  type: "colorPicker-dev",
                  disabled: style3 || style4,
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "Border",
              label: t("Border"),
              options: [
                {
                  id: "checkIconBorder",
                  type: "border-dev",
                  disabled: style3 || style4,
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabCheckIconBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "checkIconBoxShadow",
                  type: "boxShadow-dev",
                  devices: "desktop",
                  disabled: style3 || style4 || isActive,
                  states: [NORMAL, HOVER, ACTIVE]
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
        !dataSourceManual && style4
          ? {
              id: "imgWidth",
              label: t("Width"),
              type: "slider-dev",
              config: {
                min: 1,
                max: 1000,
                units: [{ value: "px", title: "px" }]
              }
            }
          : {},
        !dataSourceManual && style4
          ? {
              id: "imgHeight",
              label: t("Height"),
              type: "slider-dev",
              config: {
                min: 1,
                max: 1000,
                units: [{ value: "px", title: "px" }]
              }
            }
          : {},
        !dataSourceManual && style3
          ? {
              id: "checkColorSize",
              label: t("Size"),
              type: "slider-dev",
              config: {
                min: 1,
                max: 100,
                units: [{ value: "px", title: "px" }]
              }
            }
          : {},
        style1
          ? {
              id: "checkSize",
              label: t("Size"),
              type: "slider-dev",
              config: {
                min: 1,
                max: 100,
                units: [{ value: "px", title: "px" }]
              }
            }
          : {},
        {
          id: "advancedSettings",
          devices: "desktop",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
