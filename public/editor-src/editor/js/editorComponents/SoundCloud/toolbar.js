import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarElementSoundCloudStyle } from "visual/utils/toolbar";

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: {
        icon: "nc-sound-cloud",
        title: t("SoundCloud")
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "url",
          label: t("Link"),
          type: "inputText",
          devices: "desktop",
          placeholder: t("SoundCloud Link"),
          config: {
            size: "medium"
          }
        },
        {
          id: "autoPlay",
          label: t("Autoplay"),
          type: "switch",
          devices: "desktop"
        },
        toolbarElementSoundCloudStyle({
          v,
          device,
          devices: "desktop",
          state: "normal"
        })
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
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
                  type: "border",
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
                  type: "boxShadow",
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
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          config: {
            min: dvv("smallHeight"),
            max:
              dvv("showArtwork") === "on"
                ? dvv("largeHeight")
                : dvv("mediumHeight"),
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "legacy-grid",
          separator: true,
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "grid-effects",
              width: 50,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
