import { hexToRgba } from "visual/utils/color";
import Config from "visual/global/Config";
import {
  getOptionColorHexByPalette,
  getDynamicContentChoices
} from "visual/utils/options";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  toolbarElementVideoUpload,
  toolbarElementVideoPlaySize
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

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

  const videoDynamicContentChoices = getDynamicContentChoices("richText");

  const IS_PRO = Boolean(Config.get("pro"));
  const noCover = !v.coverImageSrc;

  const customRatio = IS_PRO
    ? [
        {
          title: t("Custom Video"),
          value: "custom"
        }
      ]
    : [];

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-play",
        title: t("Video")
      },
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Video"),
              options: [
                {
                  id: "type",
                  label: t("Type"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("Youtube"),
                      value: "youtube"
                    },
                    {
                      title: t("Vimeo"),
                      value: "vimeo"
                    },
                    ...customRatio
                  ]
                },
                {
                  id: "ratio",
                  label: t("Ratio"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: "1:1", value: "1:1" },
                    { title: "3:2", value: "3:2" },
                    { title: "4:3", value: "4:3" },
                    { title: "9:16", value: "9:16" },
                    { title: "16:9", value: "16:9" },
                    { title: "21:9", value: "21:9" }
                  ]
                },
                toolbarElementVideoUpload({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal",
                  disabled: v.type !== "custom"
                }),
                {
                  id: "video",
                  label: t("Link"),
                  type: "inputText-dev",
                  devices: "desktop",
                  population: videoDynamicContentChoices,
                  disabled: v.type === "custom",
                  placeholder:
                    v.type === "youtube"
                      ? t("Youtube")
                      : v.type === "vimeo"
                      ? t("Vimeo")
                      : ""
                }
              ]
            },
            {
              id: "tabCurrentElementAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "groupSettings",
                  type: "group-dev",
                  devices: "desktop",
                  disabled: v.type === "vimeo",
                  options: [
                    {
                      id: "controls",
                      label: t("Controls"),
                      type: "switch-dev"
                    },
                    {
                      id: "controlsIconCustomSize",
                      type: "slider-dev",
                      label: t("Size"),
                      disabled: v.type !== "custom" || dvv("controls") !== "on",
                      config: {
                        min: 1,
                        max: 40,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "branding",
                  label: t("Branding"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: v.controls !== "on" || v.type !== "youtube"
                },
                {
                  id: "intro",
                  label: t("Intro"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: v.type !== "vimeo"
                },
                {
                  id: "autoplay",
                  label: t("Autoplay"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled:
                    v.type !== "custom" || v.controls === "off" || !noCover
                },
                {
                  id: "muted",
                  label: t("Muted"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled:
                    v.type !== "custom" ||
                    (noCover && v.controls === "off") ||
                    (noCover && v.autoplay === "on")
                },
                {
                  id: "loop",
                  label: t("Loop"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: v.type !== "custom"
                },
                {
                  id: "start",
                  type: "number-dev",
                  label: t("Start"),
                  helper: {
                    content: t("Specify a start time (in seconds)")
                  },
                  config: {
                    size: "short",
                    max: 99999,
                    spinner: false
                  }
                },
                {
                  id: "end",
                  type: "number-dev",
                  label: t("End"),
                  helper: {
                    content: t("Specify an end time (in seconds)")
                  },
                  config: {
                    size: "short",
                    max: 99999,
                    spinner: false
                  }
                }
              ]
            },
            {
              id: "tabCurrentElementCover",
              label: t("Cover"),
              options: [
                {
                  label: t("Cover"),
                  id: "cover",
                  type: "imageUpload-dev",
                  devices: "desktop"
                },
                {
                  id: "coverZoom",
                  label: t("Zoom"),
                  type: "slider-dev",
                  devices: "desktop",
                  disabled: noCover,
                  config: {
                    min: 100,
                    max: 300,
                    units: [{ value: "%", title: "%" }]
                  }
                },
                toolbarElementVideoPlaySize({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop",
                  disabled: noCover
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 90,
      disabled: v.type !== "custom" || v.controls === "off",
      options: [
        {
          id: "typography",
          type: "typography-dev",
          config: {
            fontFamily: "desktop" === device
          }
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
            backgroundColor: noCover
              ? hexToRgba(borderColorHex, v.borderColorOpacity)
              : hexToRgba(bgColorHex, v.bgColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabIcon",
              label: t("Icons"),
              options: [
                {
                  id: "iconControlsColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER],
                  disabled: v.type !== "custom" || v.controls === "off"
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bar"),
              options: [
                {
                  id: "controlsBgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER],
                  disabled: v.type !== "custom" || v.controls === "off"
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
                  states: [NORMAL, HOVER],
                  disabled: v.type !== "custom" || v.controls === "off"
                }
              ]
            },
            {
              id: "tabPlay",
              label: t("Play"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER],
                  disabled: noCover || v.autoplay === "on"
                }
              ]
            },
            {
              id: "icon",
              label: t("Icon"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER],
                  disabled: noCover || v.autoplay === "on"
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
                  states: [NORMAL, HOVER],
                  disabled: v.type === "custom"
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
          position: 80,
          type: "slider-dev",
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
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
