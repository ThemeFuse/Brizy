import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const borderColor = getColor(
    dvv("borderColorPalette"),
    dvv("borderColorHex"),
    dvv("borderColorOpacity")
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
        {
          id: "style",
          label: t("Style"),
          type: "radioGroup",
          choices: [
            {
              value: "basic",
              icon: "nc-sndcloud-style-1"
            },
            {
              value: "artwork",
              icon: "nc-sndcloud-style-2"
            }
          ]
        }
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
            backgroundColor: borderColor
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
          type: "grid",
          config: {
            separator: true
          },
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
