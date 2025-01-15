import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isBackgroundPointerEnabled } from "visual/global/Config/types/configs/featuresValue";
import { isPopup } from "visual/global/EditorModeContext";
import { getColor } from "visual/utils/color";
import { BgRepeat, BgSize } from "visual/utils/containers/types";
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
import { Toggle } from "visual/utils/options/utils/Type";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { capitalize } from "visual/utils/string";
import { read as readString } from "visual/utils/string/specs";
import { toolbarLinkAnchor } from "visual/utils/toolbar";

export function getItems({ v, device, component, context, state, editorMode }) {
  const config = component.getGlobalConfig();

  const _isPopup = isPopup(editorMode);
  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  const isPointerEnabled = isBackgroundPointerEnabled(config, "column");

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const dvvState = (key, state) => defaultValueValue({ v, key, device, state });

  const bgColor = getColor(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );
  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

  const media = dvv("media");

  const maskShape = readString(dvv("maskShape")) ?? "none";
  const maskPosition = readString(dvv("maskPosition")) ?? "center center";
  const maskSize = readString(dvv("maskSize")) ?? "cover";
  const maskScaleSuffix = readString(dvv("maskScaleSuffix")) ?? "%";
  const maskCustomUploadImageSrc = readString(dvv("maskCustomUploadImageSrc"));
  const disableMaskTab = dvvState("media", NORMAL) !== "image";
  const maskShapeIsDisabled =
    maskShape === "none" ||
    (maskShape === "custom" && !maskCustomUploadImageSrc) ||
    disableMaskTab;

  const customVideo = isPro(config)
    ? [
        {
          title: t("Custom Video"),
          value: "bgVideoCustom"
        }
      ]
    : [];

  const videoType = dvv("bgVideoType");
  const coverBg = dvv("bgSize") === BgSize.Cover;

  const imageMedia = media === "image";
  const youtubeType = videoType === "youtube";
  const vimeoType = videoType === "vimeo";
  const customType = videoType === "bgVideoCustom";
  const urlType = videoType === "url";
  const linkDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
  });

  const image = media !== "image";
  const video = media !== "video";
  const map = media !== "map";

  const isExternalImage = dvv("bgImageType") !== ImageType.Internal;
  const linkPopup = dvv("linkPopup");
  const deviceCapitalize = capitalize(device);

  return [
    {
      id: `showOn${deviceCapitalize}`,
      type: "showOnDevice",
      devices: "responsive",
      position: 10,
      preserveId: true,
      choices: [
        {
          icon: "nc-eye-17",
          title: `${t("Disable on")} ${deviceCapitalize}`,
          value: Toggle.ON
        },
        {
          icon: "nc-eye-ban-18",
          title: `${t("Enable on")} ${deviceCapitalize}`,
          value: Toggle.OFF
        }
      ]
    },
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
                    { value: "map", icon: "nc-media-map" }
                  ]
                },
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload",
                  devices: "desktop",
                  states: [NORMAL, HOVER],
                  population: imageDynamicContentChoices,
                  disabled: image,
                  config: {
                    disableSizes: isExternalImage,
                    pointer: !isExternalImage && isPointerEnabled
                  }
                },
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload",
                  devices: "responsive",
                  states: [NORMAL, HOVER],
                  population: imageDynamicContentChoices,
                  disabled: image,
                  config: {
                    disableSizes: isExternalImage,
                    pointer: !isExternalImage && isPointerEnabled
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
                  id: "bgVideoType",
                  label: t("Video type"),
                  type: "select",
                  devices: "desktop",
                  disabled: video,
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
                  disabled: video || customType,
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
                  disabled: video || !customType
                },
                {
                  id: "bgVideoLoop",
                  label: t("Loop"),
                  type: "switch",
                  devices: "desktop",
                  disabled: video
                },
                {
                  id: "bgMapAddress",
                  label: t("Address"),
                  type: "inputText",
                  devices: "desktop",
                  disabled: map,
                  placeholder: t("Enter address")
                },
                {
                  id: "bgMapZoom",
                  label: t("Zoom"),
                  type: "slider",
                  devices: "desktop",
                  disabled: map,
                  config: {
                    min: 1,
                    max: 21
                  }
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
                  states: [NORMAL, HOVER],
                  disabled: !maskShapeIsDisabled
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
      position: 100,
      devices: "desktop",
      disabled:
        device === "desktop"
          ? dvv("linkLightBox") === "on"
          : dvv("linkType") !== "popup" || dvv("linkPopup") === "",
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
                  label: t("Find Page")
                },
                {
                  id: "linkInternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch"
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
                    type: "inputText",
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
                  disabled:
                    device === "desktop"
                      ? inPopup || inPopup2 || _isPopup
                      : dvv("linkType") !== "popup" || linkPopup === "",
                  config: {
                    popupKey: `${component.getId()}_${linkPopup}`,
                    canDelete: device === "desktop"
                  },
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
          id: "groupHeight",
          type: "group",
          position: 110,
          options: [
            {
              id: "heightStyle",
              label: t("Height"),
              type: "select",
              choices: [
                { title: t("Auto"), value: "auto" },
                { title: t("Custom"), value: "custom" }
              ]
            },
            {
              id: "height",
              type: "slider",
              disabled: dvv("heightStyle") !== "custom",
              config: {
                min: 20,
                max: 999,
                units: [{ value: "px", title: "px" }]
              }
            }
          ]
        },
        {
          id: "verticalAlign",
          label: t("Content"),
          type: "radioGroup",
          position: 120,
          choices: [
            { value: "top", icon: "nc-align-top" },
            { value: "center", icon: "nc-align-middle" },
            { value: "bottom", icon: "nc-align-bottom" },
            { value: "between", icon: "nc-space-between" }
          ]
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
