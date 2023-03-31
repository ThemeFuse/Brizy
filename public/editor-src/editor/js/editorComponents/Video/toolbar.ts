import { ElementModel } from "visual/component/Elements/Types";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarElementVideoPlaySize } from "visual/utils/toolbar";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { ToolbarItemType } from "../ToolbarItemType";

export interface Value extends ElementModel {
  bgColorHex: string;
  bgColorPalette: string;
  borderColorOpacity: number;

  borderColorHex: string;
  borderColorPalette: string;
  bgColorOpacity: number;

  coverImageSrc: string;

  type: "youtube" | "vimeo" | "custom" | "url";
  ratio: "1:1" | "3:2" | "4:3" | "9:16" | "16:9" | "21:9";
}

export function getItems({
  v,
  device,
  context
}: {
  v: Value;
  device: ResponsiveMode;
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const config = Config.getAll();

  const IS_STORY = isStory(config);
  const IS_PRO = Boolean(config.pro);

  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  const videoDynamicContentChoices = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.link
  );

  const type = dvv("type");
  const noCover = !dvv("coverImageSrc");

  const youtubeType = type === "youtube";
  const vimeoType = type === "vimeo";
  const customType = type === "custom";
  const urlType = type === "url";
  const offControls = dvv("controls") === "off";
  const onAutoplay = dvv("autoplay") === "on";

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
                    { title: t("YouTube"), value: "youtube" },
                    { title: t("Vimeo"), value: "vimeo" },
                    ...customRatio,
                    { title: t("URL"), value: "url" }
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
                {
                  id: "custom",
                  type: "fileUpload-dev",
                  label: t("File"),
                  config: {
                    allowedExtensions: ["video/*"]
                  },
                  devices: "desktop",
                  disabled: !customType
                },
                {
                  id: "video",
                  label: t("Link"),
                  type: "inputText-dev",
                  devices: "desktop",
                  population: videoDynamicContentChoices,
                  disabled: customType,
                  placeholder: youtubeType
                    ? t("YouTube")
                    : vimeoType
                    ? t("Vimeo")
                    : t("https://"),
                  helper: {
                    content: urlType ? t("This is .mp4 URL.") : ""
                  }
                }
              ]
            },
            {
              id: "tabCurrentElementPlayback",
              label: t("Playback"),
              options: [
                {
                  id: "autoplay",
                  label: t("Autoplay"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: offControls || !noCover
                },
                {
                  id: "muted",
                  label: t("Muted"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: (noCover && offControls) || (noCover && onAutoplay)
                },
                {
                  id: "loop",
                  label: t("Loop"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "suggestedVideos",
                  label: t("Suggested Videos"),
                  type: "select-dev",
                  devices: "desktop",
                  disabled: !youtubeType,
                  choices: [
                    { title: "Current Video Channel", value: "current" },
                    { title: "Any Video", value: "any" }
                  ]
                },
                {
                  id: "start",
                  type: "number-dev",
                  label: t("Start"),
                  devices: "desktop",
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
                  devices: "desktop",
                  disabled: vimeoType,
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
              id: "tabCurrentElementPlayer",
              label: t("Player"),
              options: [
                {
                  label: t("Cover Image"),
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
                // @ts-expect-error: Old option
                toolbarElementVideoPlaySize({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop",
                  disabled: noCover
                }),
                {
                  id: "groupSettings",
                  type: "group-dev",
                  devices: "desktop",
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
                      disabled: !customType || dvv("controls") !== "on",
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
                  disabled: offControls || !youtubeType
                },
                {
                  id: "intro",
                  label: t("Intro"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: !vimeoType
                },
                {
                  id: "lazyLoad",
                  label: t("Lazy Load"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: !youtubeType
                },
                {
                  id: "privacyMode",
                  label: t("Privacy Mode"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: !youtubeType
                }
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
      disabled: !customType || offControls,
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
              ? hexToRgba(borderColorHex, dvv("borderColorOpacity"))
              : hexToRgba(bgColorHex, dvv("bgColorOpacity"))
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
                  disabled: !customType || offControls
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
                  disabled: !customType || offControls
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
                  disabled: !customType || offControls
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
                  disabled: noCover || onAutoplay
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
                  disabled: noCover || onAutoplay
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Bg"),
              options: [
                {
                  id: "padding",
                  type: "backgroundColor-dev",
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
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      disabled: IS_STORY,
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
          id: "grid",
          type: "grid-dev",
          config: { separator: true },
          columns: [
            {
              id: "grid-settings",
              size: 1,
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
              size: 1,
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
    },
    {
      id: "advancedSettings",
      // @ts-expect-error: Missing in new option-types
      type: "advancedSettings",
      position: 110,
      disabled: !IS_STORY,
      icon: "nc-cog",
      devices: "desktop"
    }
  ];
}
