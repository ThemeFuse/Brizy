import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { NORMAL, HOVER } from "visual/utils/stateMode";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { toolbarElementSoundCloudStyle } from "visual/utils/toolbar";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-audio",
      title: t("Audio"),
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElementUpload",
              label: t("Audio"),
              options: [
                {
                  id: "url",
                  label: t("Link"),
                  type: "inputText-dev",
                  devices: "desktop",
                  disabled: dvv("type") === "custom",
                  placeholder: t("SoundCloud Link")
                },

                toolbarElementSoundCloudStyle({
                  v,
                  device,
                  devices: "desktop",
                  disabled: dvv("type") === "custom",
                  state: "normal"
                }),
                {
                  id: "autoPlay",
                  label: t("Auto Play"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: dvv("type") === "custom"
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
      devices: "desktop",
      roles: ["admin"],
      position: 100,
      icon: {
        style: {
          backgroundColor:
            v.bgColorOpacity > 0
              ? hexToRgba(borderColorHex, v.borderColorOpacity)
              : hexToRgba(bgColorHex, v.bgColorOpacity)
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabIcon",
              label: t("Icon"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  disabled: dvv("type") === "soundcloud",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER],
                  disabled: dvv("type") === "soundcloud"
                }
              ]
            },
            {
              id: "tabBgProgress",
              label: t("Slider"),
              options: [
                {
                  id: "bg2Color",
                  type: "colorPicker-dev",
                  disabled: dvv("type") === "soundcloud",
                  states: [NORMAL, HOVER]
                }
              ]
            },
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
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
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
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          config: {
            min: 40,
            max: 300,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          devices: "desktop",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
