import { KenEffect, Transition } from "visual/component/Background/type";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isBackgroundPointerEnabled } from "visual/global/Config/types/configs/featuresValue";
import { isPopup } from "visual/providers/EditorModeProvider";
import { getColorToolbar } from "visual/utils/color";
import { BgPosition, BgRepeat, BgSize } from "visual/utils/containers/types";
import { isPro } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import { ImageType } from "visual/utils/image/types";
import {
  getMaskPositions,
  getMaskRepeat,
  getMaskShapes,
  getMaskSizes
} from "visual/utils/mask/Mask";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { popupToOldModel } from "visual/utils/options/PromptAddPopup/utils";
import { read as readArr } from "visual/utils/reader/array";
import { read as jsonRead } from "visual/utils/reader/json";
import { read as readString } from "visual/utils/reader/string";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import { toolbarLinkAnchor } from "visual/utils/toolbar";
import { getMaxContainerSuffix, getMinContainerSuffix } from "../utils";

export const getItems: GetItems = ({
  v,
  device,
  component,
  state,
  context,
  editorMode
}) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const dvvState = (key: string, state: State): unknown =>
    defaultValueValue({ v, key, device, state });
  const config = component.getGlobalConfig();

  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );
  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

  const customVideo = isPro(config)
    ? [
        {
          title: t("Custom Video"),
          value: "bgVideoCustom"
        }
      ]
    : [];

  const isBackgroundEnabled = isBackgroundPointerEnabled(config, "section");

  const media = dvv("media");

  const maskShape = readString(dvv("maskShape")) ?? "none";
  const maskPosition = readString(dvv("maskPosition")) ?? "center center";
  const maskSize = readString(dvv("maskSize")) ?? "cover";
  const maskScaleSuffix = readString(dvv("maskScaleSuffix")) ?? "%";
  const maskCustomUploadImageSrc = readString(dvv("maskCustomUploadImageSrc"));
  const disableMaskTab = dvvState("media", NORMAL) !== "image";
  const linkPopup = dvv("linkPopup");
  const maskShapeIsDisabled =
    maskShape === "none" ||
    (maskShape === "custom" && !maskCustomUploadImageSrc) ||
    disableMaskTab;

  // @ts-expect-error need to add type isSlider
  const { isSlider: inSlider } = component.props.meta.section;

  const imageMedia = media === "image";
  const videoMedia = media !== "video";
  const mapMedia = media !== "map";
  const slideshowMedia = media === "slideshow";

  const videoType = dvv("bgVideoType");
  const coverBg = dvv("bgSize") === BgSize.Cover;

  const youtubeType = videoType === "youtube";
  const vimeoType = videoType === "vimeo";
  const customType = videoType === "bgVideoCustom";
  const urlType = videoType === "url";
  const isExternalImage = dvv("bgImageType") !== ImageType.Internal;

  const linkDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
  });

  const _isPopup = isPopup(editorMode);
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  const slideshow = dvv("slideshow");
  const slideshowLength = slideshow
    ? (readArr(jsonRead(slideshow)) ?? []).length
    : 0;

  const tConfig = {
    min: 1,
    max: 10,
    inputMin: 1,
    inputMax: 10,
    step: 0.1,
    units: [{ value: "s", title: "s" }]
  };

  const isDisabledInternalLink = !config.ui?.features?.internalLink;

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Background"),
              options: [
                {
                  id: "media",
                  label: t("Type"),
                  type: "radioGroup",
                  choices: [
                    { value: "image", icon: "nc-media-image" },
                    { value: "video", icon: "nc-media-video" },
                    { value: "map", icon: "nc-media-map" },
                    { value: "slideshow", icon: "nc-reorder" }
                  ]
                },
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload",
                  states:
                    // https://github.com/bagrinsergiu/blox-editor/issues/9032
                    imageMedia ? [NORMAL, HOVER] : undefined,
                  disabled: !imageMedia,
                  population: imageDynamicContentChoices,
                  config: {
                    disableSizes: isExternalImage,
                    pointer: !isExternalImage && isBackgroundEnabled
                  }
                },
                {
                  id: "bgSize",
                  label: t("Size"),
                  type: "select",
                  disabled: !imageMedia,
                  choices: [
                    { title: t("Cover"), value: BgSize.Cover },
                    { title: t("Contain"), value: BgSize.Contain },
                    { title: t("Auto"), value: BgSize.Auto }
                  ]
                },
                {
                  id: "bgPosition",
                  type: "select",
                  label: t("Position"),
                  disabled: !slideshowMedia,
                  choices: [
                    { title: t("Default"), value: BgPosition.Default },
                    { title: t("Center Left"), value: BgPosition.CenterLeft },
                    {
                      title: t("Center Center"),
                      value: BgPosition.CenterCenter
                    },
                    { title: t("Center Right"), value: BgPosition.CenterRight },
                    { title: t("Top Center"), value: BgPosition.TopCenter },
                    { title: t("Top Left"), value: BgPosition.TopLeft },
                    { title: t("Top Right"), value: BgPosition.TopRight },
                    {
                      title: t("Bottom Center"),
                      value: BgPosition.BottomCenter
                    },
                    { title: t("Bottom Left"), value: BgPosition.BottomLeft },
                    { title: t("Bottom Right"), value: BgPosition.BottomRight }
                  ]
                },
                {
                  id: "bgRepeat",
                  label: t("Repeat"),
                  type: "select",
                  disabled: !imageMedia || coverBg,
                  choices: [
                    { title: t("No repeat"), value: BgRepeat.Off },
                    { title: t("Repeat"), value: BgRepeat.On },
                    { title: t("Repeat-X"), value: BgRepeat.RepeatX },
                    { title: t("Repeat-Y"), value: BgRepeat.RepeatY }
                  ]
                },
                {
                  id: "bgAttachment",
                  label: t("Parallax"),
                  type: "select",
                  devices: "desktop",
                  disabled: !imageMedia || !coverBg || inSlider,
                  choices: [
                    { title: t("None"), value: "none" },
                    { title: t("Fixed"), value: "fixed" },
                    { title: t("Animated"), value: "animated" }
                  ]
                },
                {
                  id: "bgVideoType",
                  label: t("Video type"),
                  type: "select",
                  devices: "desktop",
                  disabled: videoMedia,
                  choices: [
                    { title: t("Youtube"), value: "youtube" },
                    { title: t("Vimeo"), value: "vimeo" },
                    ...customVideo,
                    { title: t("URL"), value: "url" }
                  ]
                },
                {
                  id: "bgVideo",
                  label: t("Link"),
                  type: "inputText",
                  devices: "desktop",
                  disabled: videoMedia || customType,
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
                },
                {
                  id: "bgVideoCustom",
                  label: t("File"),
                  type: "fileUpload",
                  config: {
                    allowedExtensions: ["video/*"]
                  },
                  devices: "desktop",
                  disabled: videoMedia || !customType
                },
                {
                  id: "bgVideoLoop",
                  label: t("Loop"),
                  type: "switch",
                  devices: "desktop",
                  disabled: videoMedia
                },
                {
                  id: "bgVideoStart",
                  type: "number",
                  label: t("Start"),
                  devices: "desktop",
                  disabled: videoMedia,
                  config: {
                    size: "short",
                    spinner: false,
                    max: 99999
                  },
                  helper: {
                    content: t("Specify a start time (in seconds)")
                  }
                },
                {
                  id: "bgMapAddress",
                  label: t("Address"),
                  type: "inputText",
                  placeholder: t("Enter address"),
                  devices: "desktop",
                  disabled: mapMedia
                },
                {
                  id: "bgMapZoom",
                  label: t("Zoom"),
                  type: "slider",
                  devices: "desktop",
                  disabled: mapMedia,
                  config: {
                    min: 1,
                    max: 21
                  }
                },
                {
                  id: "slideshow",
                  type: "gallery",
                  label: t("Slides"),
                  devices: "desktop",
                  disabled: !slideshowMedia
                },
                {
                  id: "slideshowLoop",
                  type: "switch",
                  label: t("Infinite Loop"),
                  devices: "desktop",
                  disabled: !slideshowMedia
                },
                {
                  id: "slideshowDuration",
                  type: "slider",
                  label: t("Delay"),
                  disabled: !slideshowMedia,
                  devices: "desktop",
                  config: tConfig
                },
                {
                  id: "slideshowTransitionType",
                  type: "select",
                  label: t("Transition Type"),
                  devices: "desktop",
                  disabled: !slideshowMedia,
                  choices: [
                    { title: t("Fade"), value: Transition.Fade },
                    { title: t("Slide Left"), value: Transition.SlideLeft },
                    { title: t("Slide Right"), value: Transition.SlideRight },
                    { title: t("Slide Up"), value: Transition.SlideUp },
                    { title: t("Slide Down"), value: Transition.SlideDown }
                  ]
                },
                {
                  id: "slideshowTransition",
                  type: "slider",
                  label: t("Transition"),
                  devices: "desktop",
                  disabled: !slideshowMedia,
                  config: tConfig
                },
                {
                  id: "kenBurnsEffect",
                  type: "select",
                  label: t("Ken Burns"),
                  devices: "desktop",
                  disabled: !slideshowMedia || slideshowLength <= 1,
                  choices: [
                    { title: t("Off"), value: KenEffect.Off },
                    { title: t("In"), value: KenEffect.In },
                    { title: t("Out"), value: KenEffect.Out }
                  ]
                }
              ]
            },
            {
              id: "tabMask",
              label: t("Mask"),
              position: 110,
              options: [
                {
                  id: "maskShape",
                  label: t("Shape"),
                  devices: "desktop",
                  type: "select",
                  choices: getMaskShapes(),
                  disabled: disableMaskTab
                },
                {
                  id: "maskCustomUpload",
                  type: "imageUpload",
                  devices: "desktop",
                  label: t("Image"),
                  config: {
                    pointer: false,
                    disableSizes: true,
                    acceptedExtensions: ["png", "svg"]
                  },
                  helper: {
                    content: t("Upload only [ .png or .svg ]")
                  },
                  disabled: maskShape !== "custom" || disableMaskTab
                },
                {
                  id: "groupSize",
                  type: "group",
                  disabled: maskShapeIsDisabled,
                  options: [
                    {
                      id: "maskSize",
                      label: t("Size"),
                      type: "select",
                      choices: getMaskSizes()
                    },
                    {
                      id: "maskScale",
                      type: "slider",
                      disabled: maskSize !== "custom",
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
                  disabled: maskShapeIsDisabled,
                  options: [
                    {
                      id: "maskPosition",
                      type: "select",
                      label: t("Position"),
                      choices: getMaskPositions()
                    },
                    {
                      id: "maskPositionx",
                      label: t("X"),
                      type: "slider",
                      disabled: maskPosition !== "custom",
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
                  disabled: maskShapeIsDisabled || maskSize === "cover",
                  choices: getMaskRepeat()
                }
              ]
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
            backgroundColor: bgColor
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabOverlay",
              label: t("Overlay"),
              options: [
                {
                  id: "",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  config: {
                    withAnimatedGradient: true
                  }
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
              id: "tabDropShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "maskShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  disabled: maskShapeIsDisabled
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarLink",
      type: "popover",
      config: {
        icon: "nc-link",
        title: t("Link"),
        size: "medium"
      },
      position: 95,
      devices: "desktop",
      disabled:
        device === "desktop"
          ? dvv("linkLightBox") === "on"
          : dvv("linkType") !== "popup" || linkPopup === "",
      options: [
        {
          id: "linkType",
          type: "tabs",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "page",
              label: t("Page"),
              options: [
                {
                  id: "linkPage",
                  type: "internalLink",
                  label: t("Find Page"),
                  disabled: isDisabledInternalLink
                },
                {
                  id: "linkInternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch",
                  disabled: isDisabledInternalLink
                }
              ]
            },
            {
              id: "external",
              label: t("URL"),
              options: [
                {
                  id: "link",
                  type: "population",
                  label: t("Link to"),
                  config: linkDC,
                  option: {
                    id: "linkExternal",
                    type: "linkExternal",
                    placeholder: "http://"
                  }
                },
                {
                  id: "linkExternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch"
                },
                {
                  id: "linkExternalRel",
                  label: t("Make it Nofollow"),
                  type: "switch"
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              options: [
                toolbarLinkAnchor({
                  v,
                  device,
                  state: "normal",
                  disabled: _isPopup
                })
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                {
                  id: "linkPopup",
                  type: "promptAddPopup",
                  label: t("Popup"),
                  config: {
                    popupKey: `${component.getId()}_${linkPopup}`
                  },
                  disabled: inPopup || inPopup2 || _isPopup,
                  dependencies: popupToOldModel
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
          id: "containerTypeGroup",
          type: "group",
          position: 10,
          options: [
            {
              id: "containerType",
              label: t("Width"),
              devices: "desktop",
              type: "select",
              choices: [
                { title: t("Boxed"), value: "boxed" },
                { title: t("Full"), value: "fullWidth" }
              ]
            },
            {
              id: "containerSize",
              label: device === "desktop" ? "" : t("Width"),
              type: "slider",
              disabled: dvv("containerType") !== "boxed",
              config: {
                min: getMinContainerSuffix({ v, device }),
                max: getMaxContainerSuffix({ v, device }),
                units: [
                  { title: "%", value: "%" },
                  { title: "px", value: "px" }
                ]
              }
            }
          ]
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          position: 120,
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
};
