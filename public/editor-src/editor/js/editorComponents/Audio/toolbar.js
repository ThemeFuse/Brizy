import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { NORMAL, HOVER } from "visual/utils/stateMode";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
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
  const linkDC = getDynamicContentChoices("link", true);

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-audio",
        title: t("Audio")
      },
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
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
                  placeholder: t("SoundCloud Link"),
                  population: linkDC
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
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              v.bgColorOpacity > 0
                ? hexToRgba(borderColorHex, v.borderColorOpacity)
                : hexToRgba(bgColorHex, v.bgColorOpacity)
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
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
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "%", title: "%" },
              { value: "px", title: "px" }
            ]
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
