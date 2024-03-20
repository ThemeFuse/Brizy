import type { ElementModel } from "visual/component/Elements/Types";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { isPro } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import { ImageType } from "visual/utils/image/types";
import {
  MaskPositions,
  MaskRepeat,
  MaskShapes,
  MaskSizes
} from "visual/utils/mask/Mask";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { read as readString } from "visual/utils/reader/string";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { getMaxContainerSuffix, getMinContainerSuffix } from "../utils";

export const getItems: GetItems<ElementModel> = ({
  v,
  device,
  component,
  state,
  context
}) => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

  const config = Config.getAll();
  const customVideo = isPro(config)
    ? [
        {
          title: t("Custom Video"),
          value: "bgVideoCustom"
        }
      ]
    : [];

  const media = dvv("media");
  const isDesktop = device === "desktop";

  const maskShape = readString(dvv("maskShape")) ?? "none";
  const maskPosition = readString(dvv("maskPosition")) ?? "center center";
  const maskSize = readString(dvv("maskSize")) ?? "cover";
  const maskScaleSuffix = readString(dvv("maskScaleSuffix")) ?? "%";
  const maskCustomUploadImageSrc = readString(dvv("maskCustomUploadImageSrc"));
  const disableMaskTab = media !== "image";
  const maskShapeIsDisabled =
    maskShape === "none" ||
    (maskShape === "custom" && !maskCustomUploadImageSrc) ||
    disableMaskTab;

  // @ts-expect-error need to add type isSlider
  const { isSlider: inSlider } = component.props.meta.section;

  const imageMedia = media === "image";
  const videoMedia = media !== "video";
  const mapMedia = media !== "map";

  const videoType = dvv("bgVideoType");
  const coverBg = dvv("bgSize") === "cover";

  const youtubeType = videoType === "youtube";
  const vimeoType = videoType === "vimeo";
  const customType = videoType === "bgVideoCustom";
  const urlType = videoType === "url";

  const isExternalImage = dvv("bgImageType") === ImageType.External;

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
                  devices: "desktop",
                  choices: [
                    { value: "image", icon: "nc-media-image" },
                    { value: "video", icon: "nc-media-video" },
                    { value: "map", icon: "nc-media-map" }
                  ]
                },
                {
                  id: "media",
                  label: t("Type"),
                  type: "radioGroup",
                  disabled: isDesktop,
                  choices: [
                    {
                      value: "image",
                      icon: "nc-media-image"
                    },
                    {
                      value: "map",
                      icon: "nc-media-map"
                    }
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
                    pointer: !isExternalImage
                  }
                },
                {
                  id: "bgSize",
                  label: t("Size"),
                  type: "select",
                  disabled: !imageMedia,
                  choices: [
                    { title: t("Cover"), value: "cover" },
                    { title: t("Contain"), value: "contain" },
                    { title: t("Auto"), value: "auto" }
                  ]
                },
                {
                  id: "bgRepeat",
                  label: t("Repeat"),
                  type: "switch",
                  disabled: !imageMedia || coverBg
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
                  disabled: mapMedia,
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
                  choices: MaskShapes,
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
                      choices: MaskSizes
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
                      choices: MaskPositions
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
                  choices: MaskRepeat
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
            backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
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
