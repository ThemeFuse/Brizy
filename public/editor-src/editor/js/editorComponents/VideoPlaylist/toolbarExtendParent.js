import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { toolbarDisabledAdvancedSettings } from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-play",
        title: t("Playlist")
      },
      position: 10,
      options: [
        {
          id: "positionItem",
          label: t("Position"),
          type: "select-dev",
          devices: "desktop",
          choices: [
            { value: "horizontal", title: "Horizontal" },
            { value: "vertical", title: "Vertical" }
          ]
        },
        {
          id: "positionThumbs",
          label: t("Thumbs"),
          type: "select-dev",
          devices: "desktop",
          disabled: v.positionItem === "horizontal",
          choices: [
            { value: "above", title: "Top" },
            { value: "under", title: "Bottom" }
          ]
        },
        {
          id: "gridColumn",
          label: t("Columns"),
          type: "slider-dev",
          disabled: v.positionItem === "horizontal",
          config: {
            min: 1,
            max: 6
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
            backgroundColor: hexToRgba(
              borderColorHex,
              dvv("borderColorOpacity")
            )
          }
        }
      },
      position: 90,
      devices: "desktop",
      roles: ["admin"],
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
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
    },
    toolbarDisabledAdvancedSettings({ device }),
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "widthSidebar",
          label: t("Sidebar"),
          type: "slider-dev",
          disabled: v.positionItem === "vertical" || device === "mobile",
          config: {
            min: 200,
            max: 1000,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
