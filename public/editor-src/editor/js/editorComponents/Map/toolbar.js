import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );
  const richTextDC = getDynamicContentChoices("richText", true);

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-pin",
        title: t("Map")
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
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
                  population: richTextDC
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
      disabled: dvv("coverImageSrc") === "",
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
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "size",
          label: t("Size"),
          type: "slider-dev",
          position: 80,
          config: {
            min: 1,
            max: dvv("sizeSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          config: {
            min: 5,
            max: dvv("heightSuffix") === "%" ? 100 : 500,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
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
