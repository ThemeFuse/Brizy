import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const mapDynamicContentChoices = getDynamicContentChoices("richText");

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-pin",
      title: t("Map"),
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Map"),
              options: [
                {
                  id: "address",
                  label: t("Address"),
                  type: "inputText-dev",
                  placeholder: t("Enter address"),
                  population: mapDynamicContentChoices
                },
                {
                  id: "zoom",
                  label: t("Zoom"),
                  type: "slider-dev",
                  config: {
                    min: 1,
                    max: 21
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
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 90,
      devices: "desktop",
      disabled: dvv("coverImageSrc") === "",
      icon: {
        style: {
          backgroundColor: hexToRgba(borderColorHex, dvv("borderColorOpacity"))
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
                  devices: "desktop",
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
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "size",
          label: t("Size"),
          type: "slider-dev",
          position: 80,
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          config: {
            min: 5,
            max: 500,
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
