import { Str } from "@brizy/readers";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isBackgroundPointerEnabled } from "visual/global/Config/types/configs/featuresValue";
import { isStory } from "visual/providers/EditorModeProvider";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import {
  getMaskPositions,
  getMaskRepeat,
  getMaskSizes
} from "visual/utils/mask/Mask";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  barBgColorCSS,
  coverImageCSS,
  coverZoomCSS,
  iconCustomSizeCSS,
  iconSizeCSS,
  maskImagePosition,
  maskImagePositionX,
  maskImagePositionY,
  maskImageRepeatCSS,
  maskImageScaleCSS,
  maskImageSizeCSS,
  maskImageUrlCSS,
  playBgColorCSS,
  ratioCSS,
  sizeCSS,
  sliderBgColorCSS
} from "./css";
import { Ratio, Value } from "./types";
import { typesChoice } from "./utils";

// @ts-expect-error: "advancedSettings" missing in new option-types
export const getItems: GetItems<Value> = ({
  v,
  device,
  context,
  editorMode,
  component
}) => {
  const config = component.getGlobalConfig();

  const _isStory = isStory(editorMode);

  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );

  const borderColor = getColorToolbar(
    dvv("borderColorPalette"),
    dvv("borderColorHex"),
    dvv("borderColorOpacity")
  );

  const videoDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
  });

  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

  const isPointerEnabled = isBackgroundPointerEnabled(config, "video");

  const type = dvv("type");
  const noCover = !dvv("coverImageSrc");

  const youtubeType = type === "youtube";
  const vimeoType = type === "vimeo";
  const customType = type === "custom";
  const urlType = type === "url";
  const offControls = dvv("controls") === "off";
  const onAutoplay = dvv("autoplay") === "on";

  const containsShorts = dvv("video").includes("/shorts/");

  const isCustomOrUrl = customType || urlType;

  const maskPosition = Str.read(dvv("maskPosition")) ?? "center center";
  const maskSize = Str.read(dvv("maskSize")) ?? "cover";
  const maskScaleSuffix = Str.read(dvv("maskScaleSuffix")) ?? "%";
  const maskCustomUploadImageSrc = Str.read(dvv("maskCustomUploadImageSrc"));

  const disableMaskRepeat = !maskCustomUploadImageSrc || maskSize === "cover";

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
                  choices: typesChoice(config)
                },
                {
                  id: "ratio",
                  label: t("Ratio"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    { title: "1:1", value: Ratio.R1_1 },
                    { title: "3:2", value: Ratio.R3_2 },
                    { title: "4:3", value: Ratio.R4_3 },
                    { title: "9:16", value: Ratio.R9_16 },
                    { title: "16:9", value: Ratio.R16_9 },
                    { title: "21:9", value: Ratio.R21_9 }
                  ],
                  style: ratioCSS
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
                      ? t("Enter a link ending in .mp4")
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
                    devices: "desktop",
                    config: {
                      pointer: isPointerEnabled
                    },
                    style: coverImageCSS(config)
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
                  },
                  style: coverZoomCSS
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
                  },
                  style: iconSizeCSS
                },
                {
                  id: "lightbox",
                  label: t("Open in Lightbox"),
                  type: "switch",
                  devices: "desktop",
                  disabled: noCover || _isStory
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
                      },
                      style: iconCustomSizeCSS
                    }
                  ]
                },
                {
                  id: "caption",
                  label: t("Captions (CC)"),
                  type: "fileUpload",
                  devices: "desktop",
                  disabled: !isCustomOrUrl,
                  acceptedExtensions: ["vtt"],
                  helper: {
                    content: t(
                      "Upload a .vtt file with captions for your video"
                    )
                  }
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
          },
          selector: "{{WRAPPER}} .brz-video-custom-controls"
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
            backgroundColor: noCover ? borderColor : bgColor
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
                  disabled: !isCustomOrUrl || offControls,
                  selector:
                    "{{WRAPPER}} .brz-video-custom-play:hover, {{WRAPPER}} .brz-video-custom-pause:hover, {{WRAPPER}} .brz-video-custom-mute:hover, {{WRAPPER}} .brz-video-custom-unmute:hover, {{WRAPPER}} .brz-video-custom-fullscreen-icon:hover, {{WRAPPER}} .brz-video-elem > .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-current-time:hover, {{WRAPPER}} .brz-video-elem > .brz-video-custom-video-controls > .brz-video-custom-controls > .brz-video-custom-total-time:hover, {{WRAPPER}} .brz-media-caption"
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
                  disabled: !isCustomOrUrl || offControls,
                  style: barBgColorCSS(config)
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
                  disabled: !isCustomOrUrl || offControls,
                  style: sliderBgColorCSS(config)
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
                  disabled: noCover || onAutoplay,
                  style: playBgColorCSS(config)
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
                  disabled: noCover || onAutoplay,
                  selector:
                    "{{WRAPPER}}:hover .brz-video__cover .brz-video__cover-icon .brz-span"
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
                  states: [NORMAL, HOVER],
                  selector: "{{WRAPPER}}:hover .brz-video-content"
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
                  states: [NORMAL, HOVER],
                  selector: "{{WRAPPER}}:hover .brz-video-content"
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
                  states: [NORMAL, HOVER],
                  selector: "{{WRAPPER}}:hover .brz-video-content"
                }
              ]
            },
            {
              id: "tabMask",
              label: t("Mask"),
              position: 110,
              options: [
                {
                  id: "maskCustomUpload",
                  type: "imageUpload",
                  devices: "desktop",
                  label: t("Image"),
                  style: maskImageUrlCSS(config),
                  config: {
                    pointer: false,
                    disableSizes: true,
                    acceptedExtensions: ["png", "svg"]
                  },
                  helper: {
                    content: t("Upload only [ .png or .svg ]")
                  }
                },
                {
                  id: "groupSize",
                  type: "group",
                  disabled: !maskCustomUploadImageSrc,
                  options: [
                    {
                      id: "maskSize",
                      label: t("Size"),
                      type: "select",
                      choices: getMaskSizes(),
                      style: maskImageSizeCSS
                    },
                    {
                      id: "maskScale",
                      type: "slider",
                      disabled: maskSize !== "custom",
                      style: maskImageScaleCSS,
                      config: {
                        min: 1,
                        max: maskScaleSuffix === "px" ? 500 : 100,
                        units: [
                          { value: "%", title: "%" },
                          { value: "px", title: "px" }
                        ]
                      }
                    }
                  ]
                },
                {
                  id: "groupPosition",
                  type: "group",
                  disabled: !maskCustomUploadImageSrc,
                  options: [
                    {
                      id: "maskPosition",
                      type: "select",
                      label: t("Position"),
                      style: maskImagePosition,
                      choices: getMaskPositions()
                    },
                    {
                      id: "maskPositionx",
                      label: t("X"),
                      type: "slider",
                      disabled: maskPosition !== "custom",
                      style: maskImagePositionX,
                      config: {
                        min: 1,
                        max: 100,
                        units: [{ value: "%", title: "%" }]
                      }
                    },
                    {
                      id: "maskPositiony",
                      label: t("Y"),
                      type: "slider",
                      style: maskImagePositionY,
                      disabled: maskPosition !== "custom",
                      config: {
                        min: 1,
                        max: 100,
                        units: [{ value: "%", title: "%" }]
                      }
                    }
                  ]
                },
                {
                  id: "maskRepeat",
                  label: t("Repeat"),
                  type: "select",
                  style: maskImageRepeatCSS,
                  disabled: disableMaskRepeat,
                  choices: getMaskRepeat()
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
      disabled: _isStory,
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
          },
          style: sizeCSS
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
      type: "advancedSettings",
      position: 110,
      disabled: !_isStory,
      devices: "desktop"
    }
  ];
};
