import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementSearchStyle,
  toolbarSizeWidthWidthPercent
} from "visual/utils/toolbar";
import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvkn = key => defaultValueKey({ key, device });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );
  return [
    {
      id: dvkn("toolbarCurrentShortcode"),
      type: "popover",
      icon: "nc-search",
      title: t("Additionals"),
      position: 60,
      options: [
        toolbarElementSearchStyle({
          v,
          device,
          devices: "desktop",
          state: "normal"
        })
      ]
    },
    {
      id: dvkn("popoverTypography"),
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
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: dvkn("popoverColor"),
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
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: dvkn("tabBg"),
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
              id: dvkn("tabBorder"),
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
              id: dvkn("tabBoxShadow"),
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
    {
      id: dvkn("toolbarSettings"),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeWidthWidthPercent({ v, device, state: "normal" }),
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          disabled: v.searchStyle !== "minimal",
          config: {
            min: 10,
            max: 200,
            inputMin: 0,
            inputMax: 1000,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: dvkn("advancedSettings"),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
