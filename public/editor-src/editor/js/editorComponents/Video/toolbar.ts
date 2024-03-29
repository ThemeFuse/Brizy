import { ElementModel } from "visual/component/Elements/Types";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

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
// @ts-expect-error: "advancedSettings" missing in new option-types
export const getItems: GetItems<Value> = ({ v, device, context }) => {
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

  const videoDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
  });

  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

  const type = dvv("type");
  const noCover = !dvv("coverImageSrc");

  const youtubeType = type === "youtube";
  const vimeoType = type === "vimeo";
  const customType = type === "custom";
  const urlType = type === "url";
  const offControls = dvv("controls") === "off";
  const onAutoplay = dvv("autoplay") === "on";

  const containsShorts = dvv("video").includes("/shorts/");

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
      type: "popover",
      config: {
        icon: "nc-play",
        title: t("Video")
      },
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Video"),
              options: [
                {
                  id: "type",
                  label: t("Type"),
                  type: "select",
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
                  type: "select",
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
                  type: "fileUpload",
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
                  type: "inputText",
                  devices: "desktop",
                  population: videoDynamicContentChoices,
                  disabled: customType,
                  placeholder: youtubeType
                    ? t("YouTube")
                    : vimeoType
                    ? t("Vimeo")
                    : t("https://"),
                  helper: {
                    content: urlType
                      ? t("This is .mp4 URL.")
                      : youtubeType
                      ? t(
                          "Use the regular video links generated by YouTube. The 'feature=share' parameter is not a valid or recognized parameter by the YouTube platform."
                        )
                      : ""
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
                  type: "switch",
                  devices: "desktop",
                  disabled: offControls || !noCover
                },
                {
                  id: "muted",
                  label: t("Muted"),
                  type: "switch",
                  devices: "desktop",
                  disabled: (noCover && offControls) || (noCover && onAutoplay)
                },
                {
                  id: "loop",
                  label: t("Loop"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "suggestedVideos",
                  label: t("Suggested Videos"),
                  type: "select",
                  devices: "desktop",
                  disabled: !youtubeType,
                  choices: [
                    { title: t("Current Video Channel"), value: "current" },
                    { title: t("Any Video"), value: "any" }
                  ]
                },
                {
                  id: "start",
                  type: "number",
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
                  type: "number",
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
                // Use population option type instead of using the `legacy-population` config for imageUpload,
                // because the population id and imageUpload id are different.
                {
                  id: "coverImageSrc",
                  type: "population",
                  label: t("Cover Image"),
                  config:
                    device === "desktop" && imageDynamicContentChoices
                      ? imageDynamicContentChoices
                      : undefined,
                  option: {
                    id: "cover",
                    type: "imageUpload",
                    devices: "desktop"
                  }
                },
                {
                  id: "coverZoom",
                  label: t("Zoom"),
                  type: "slider",
                  devices: "desktop",
                  disabled: noCover,
                  config: {
                    min: 100,
                    max: 300,
                    units: [{ value: "%", title: "%" }]
                  }
                },
                {
                  id: "iconSize",
                  label: t("Play"),
                  type: "slider",
                  devices: "desktop",
                  disabled: noCover,
                  config: {
                    min: 50,
                    max: 200,
                    inputMin: 50,
                    inputMax: 200,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "groupSettings",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "controls",
                      label: t("Controls"),
                      type: "switch",
                      disabled: containsShorts
                    },
                    {
                      id: "controlsIconCustomSize",
                      type: "slider",
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
                  type: "switch",
                  devices: "desktop",
                  disabled: offControls || !youtubeType || containsShorts
                },
                {
                  id: "intro",
                  label: t("Intro"),
                  type: "switch",
                  devices: "desktop",
                  disabled: !vimeoType
                },
                {
                  id: "lazyLoad",
                  label: t("Lazy Load"),
                  type: "switch",
                  devices: "desktop",
                  disabled: !youtubeType
                },
                {
                  id: "privacyMode",
                  label: t("Privacy Mode"),
                  type: "switch",
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
      type: "popover",
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
          type: "typography",
          config: {
            fontFamily: "desktop" === device
          }
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
          type: "tabs",
          tabs: [
            {
              id: "tabIcon",
              label: t("Icons"),
              options: [
                {
                  id: "iconControlsColor",
                  type: "colorPicker",
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
                  type: "colorPicker",
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
                  type: "colorPicker",
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
                  type: "colorPicker",
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
                  type: "colorPicker",
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
                  type: "backgroundColor",
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
      disabled: IS_STORY,
      options: [
        {
          id: "size",
          label: t("Size"),
          position: 80,
          type: "slider",
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
          type: "grid",
          config: { separator: true },
          columns: [
            {
              id: "grid-settings",
              size: 1,
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
              size: 1,
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
    },
    {
      id: "advancedSettings",
      type: "legacy-advancedSettings",
      position: 110,
      disabled: !IS_STORY,
      icon: "nc-cog",
      devices: "desktop"
    }
  ];
};
