import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  return [
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    },
    {
      id: "popoverCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-facebook",
        title: t("Embed")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Embed"),
              options: [
                {
                  id: "type",
                  label: t("Embed"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("Post"),
                      value: "post"
                    },
                    {
                      title: t("Video"),
                      value: "video"
                    }
                  ]
                },
                {
                  label: t("Link"),
                  id: "postHref",
                  type: "inputText-dev",
                  devices: "desktop",
                  disabled: dvv("type") === "post" ? false : true
                },
                {
                  label: t("Link"),
                  id: "videoHref",
                  type: "inputText-dev",
                  devices: "desktop",
                  disabled: dvv("type") === "video" ? false : true
                },
                {
                  id: "postAndVideoShowText",
                  label: t("Include Full Post"),
                  type: "switch-dev",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "advanced",
              label: t("Advanced"),
              options: [
                {
                  id: "videoAllowFullScreen",
                  label: t("Full Screen"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: dvv("type") === "video" ? false : true
                },
                {
                  id: "videoAutoPlay",
                  label: t("AutoPlay"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: dvv("type") === "video" ? false : true
                },
                {
                  id: "videoCaptions",
                  label: t("Captions"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: dvv("type") === "video" ? false : true
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
            backgroundColor: hexToRgba(borderColorHex, v.borderColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          config: {
            showSingle: true
          },
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
    {
      id: "advancedSettings",
      type: "advancedSettings",
      roles: ["admin"],
      icon: "nc-cog",
      position: 110
    }
  ];
}
