import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const borderColor = getColorToolbar(
    dvv("borderColorPalette"),
    dvv("borderColorHex"),
    dvv("borderColorOpacity")
  );

  return [
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true
    },
    {
      id: "popoverCurrentElement",
      type: "popover",
      config: {
        icon: "nc-facebook",
        title: t("Embed")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Embed"),
              options: [
                {
                  id: "type",
                  label: t("Embed"),
                  type: "select",
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
                  type: "inputText",
                  devices: "desktop",
                  disabled: dvv("type") === "post" ? false : true,
                  config: {
                    size: "medium"
                  }
                },
                {
                  label: t("Link"),
                  id: "videoHref",
                  type: "inputText",
                  devices: "desktop",
                  disabled: dvv("type") === "video" ? false : true,
                  config: {
                    size: "medium"
                  }
                },
                {
                  id: "postAndVideoShowText",
                  label: t("Include Full Post"),
                  type: "switch",
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
                  type: "switch",
                  devices: "desktop",
                  disabled: dvv("type") === "video" ? false : true
                },
                {
                  id: "videoAutoPlay",
                  label: t("AutoPlay"),
                  type: "switch",
                  devices: "desktop",
                  disabled: dvv("type") === "video" ? false : true
                },
                {
                  id: "videoCaptions",
                  label: t("Captions"),
                  type: "switch",
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
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
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
      id: "advancedSettings",
      devices: "desktop",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110
    }
  ];
}
