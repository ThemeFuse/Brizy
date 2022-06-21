import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { NORMAL, HOVER } from "visual/utils/stateMode";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { toolbarElementSoundCloudStyle } from "visual/utils/toolbar";
import { defaultValueValue } from "visual/utils/onChange";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

export function getItems({ v, device, context }) {
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );
  const linkDC = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.link
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      devices: "desktop",
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
                  disabled: dvv("type") === "custom",
                  placeholder: t("SoundCloud Link"),
                  population: linkDC
                },
                toolbarElementSoundCloudStyle({
                  v,
                  device,
                  disabled: dvv("type") === "custom",
                  state: "normal"
                }),
                {
                  id: "autoPlay",
                  label: t("Auto Play"),
                  type: "switch-dev",
                  disabled: dvv("type") === "custom"
                }
              ]
            },
            {
              id: "soundCloudAdvancedOptions",
              label: t("Advanced"),
              options: [
                {
                  id: "artWork",
                  label: t("Artwork"),
                  type: "switch-dev",
                  disabled: v.type === "custom"
                },
                {
                  id: "likeButton",
                  label: t("Like Button"),
                  type: "switch-dev",
                  disabled: v.type === "custom"
                },
                {
                  id: "buyButton",
                  label: t("Buy Button"),
                  type: "switch-dev",
                  disabled: v.type === "custom"
                },
                {
                  id: "downloadButton",
                  label: t("Download Button"),
                  type: "switch-dev",
                  disabled: v.type === "custom"
                },
                {
                  id: "shareButton",
                  label: t("Share Button"),
                  type: "switch-dev",
                  disabled: v.type === "custom"
                },
                {
                  id: "comments",
                  label: t("Comments"),
                  type: "switch-dev",
                  disabled: v.type === "custom"
                },
                {
                  id: "playCounts",
                  label: t("Play Counts"),
                  type: "switch-dev",
                  disabled: v.type === "custom"
                },
                {
                  id: "username",
                  label: t("Username"),
                  type: "switch-dev",
                  disabled: v.type === "custom"
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
            },
            {
              id: "tabControls",
              label: t("Controls"),
              options: [
                {
                  id: "controls",
                  type: "colorPicker-dev",
                  disabled: v.type === "custom",
                  config: {
                    opacity: false
                  }
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
          id: "grid",
          type: "grid",
          separator: true,
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
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
                  type: "sidebarTabsButton-dev",
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
