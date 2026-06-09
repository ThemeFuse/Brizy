import { keyToDCFallback2Key } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isImagePointerEnabled } from "visual/global/Config/types/configs/featuresValue";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { ImageType } from "visual/utils/image/types";
import { isGIFExtension, isSVGExtension } from "visual/utils/image/utils";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { read as readString } from "visual/utils/reader/string";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { SizeType } from "../../global/Config/types/configs/common";
import { Device, V as Value } from "../Image/types";
import { getImageDCSize } from "../Image/utils";
import { Props } from "./types";

interface Data {
  desktopContainerWidth: number;
  tabletContainerWidth: number;
  mobileContainerWidth: number;
}

type Property = Record<Device, { cW: number }>;

export default ({
  desktopContainerWidth,
  tabletContainerWidth,
  mobileContainerWidth
}: Data) => ({
  getItems: getItems({
    property: {
      desktop: {
        cW: desktopContainerWidth
      },
      tablet: {
        cW: tabletContainerWidth
      },
      mobile: {
        cW: mobileContainerWidth
      }
    }
  })
});

export const getItems =
  ({ property }: { property: Property }): GetItems<Value, Props> =>
  ({ v, device, component, context, state }) => {
    const config = component.getGlobalConfig();

    const { cW } = property[device];

    const isPointerEnabled = isImagePointerEnabled(config);

    const dvv = (key: string) => defaultValueValue({ v, key, device });

    const bgColorOpacity = dvv("bgColorOpacity");
    const bgColor = getColorToolbar(
      dvv("bgColorPalette"),
      dvv("bgColorHex"),
      bgColorOpacity
    );

    const maskShape = readString(dvv("maskShape")) ?? "none";
    const maskCustomUploadImageSrc = readString(
      dvv("maskCustomUploadImageSrc")
    );
    const maskShapeIsDisabled =
      maskShape === "none" ||
      (maskShape === SizeType.custom && !maskCustomUploadImageSrc);

    const widthSuffixValue = dvv("widthSuffix");
    const heightSuffixValue = dvv("heightSuffix");
    const sizeType = dvv("sizeType");

    const imageDynamicContentChoices = getDynamicContentOption({
      options: context.dynamicContent.config,
      type: DCTypes.image
    });

    const imageExtension = dvv("imageExtension");
    const imagePopulation = dvv("imagePopulation");
    const isExternalImage = dvv("imageType") !== ImageType.Internal;

    const dcSize = getImageDCSize(imagePopulation, context);
    const isCustomSizeType = sizeType === SizeType.custom;
    const isSvgOrGif =
      (isSVGExtension(imageExtension) || isGIFExtension(imageExtension)) &&
      !dcSize;

    const imageCount = state === HOVER ? 2 : 1;

    return [
      {
        id: "toolbarImage",
        type: "popover",
        config: {
          icon: "nc-img",
          title: t("Image")
        },
        position: 80,
        options: [
          {
            id: "media",
            type: "tabs",
            tabs: [
              {
                id: "tabImage",
                label: t("Image"),
                options: [
                  // Use population option type instead of using the `legacy-population` config for imageUpload,
                  // because the population id and imageUpload id are different.
                  {
                    id: "image",
                    type: "population",
                    label: t("Image") + " " + imageCount,
                    states: [NORMAL, HOVER],
                    statesConfig: {
                      normal: {
                        icon: "nc-comparison-first",
                        title: t("First Image")
                      },
                      hover: {
                        icon: "nc-comparison-second",
                        title: t("Second Image")
                      }
                    },
                    disabled:
                      (isSVGExtension(imageExtension) ||
                        isGIFExtension(imageExtension) ||
                        isExternalImage ||
                        imagePopulation) &&
                      device !== "desktop",
                    config:
                      device === "desktop" && imageDynamicContentChoices
                        ? imageDynamicContentChoices
                        : undefined,
                    fallback: {
                      id: keyToDCFallback2Key("image"),
                      type: "imageUpload",
                      config: {
                        pointer: isPointerEnabled,
                        edit: device === "desktop"
                      }
                    },
                    option: {
                      id: "",
                      type: "imageUpload",
                      devices: "desktop",
                      config: {
                        edit: device === "desktop",
                        disableSizes: isExternalImage || state === "hover",
                        pointer: !isExternalImage && isPointerEnabled
                      }
                    }
                  },
                  {
                    id: "enableLazyLoad",
                    label: t("Lazy Load"),
                    type: "switch",
                    devices: "desktop",
                    helper: {
                      content: t(
                        "Load this image only when it's about to enter the viewport"
                      )
                    }
                  },
                  {
                    id: "sliderType",
                    label: t("Slider Type"),
                    type: "radioGroup",
                    devices: "desktop",
                    choices: [
                      {
                        value: "horizontal",
                        icon: "t2-horisontal-thumb",
                        title: "Horizontal"
                      },
                      {
                        value: "vertical",
                        icon: "t2-vertical-thumb",
                        title: "Vertical"
                      }
                    ]
                  }
                ]
              },
              {
                id: "tabFilters",
                label: t("Filters"),
                options: [
                  {
                    id: "image",
                    type: "filters",
                    states: [NORMAL, HOVER]
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
        roles: ["admin"],
        position: 80,
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
              },
              {
                id: "tabArrow",
                label: t("Arrow"),
                options: [
                  {
                    id: "thumbArrowColor",
                    type: "colorPicker",
                    states: [NORMAL]
                  }
                ]
              },
              {
                id: "tabArrowBg",
                label: t("Arrow Bg."),
                options: [
                  {
                    id: "thumbArrowBgColor",
                    type: "colorPicker",
                    states: [NORMAL]
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
        roles: ["admin"],
        position: 110,
        options: [
          {
            id: "width",
            label: isSvgOrGif ? t("Size") : t("Width"),
            type: "slider",
            disabled: !isCustomSizeType && !isSvgOrGif,
            config: {
              min: 5,
              max: widthSuffixValue === "px" ? cW : 100,
              units: [
                { value: "px", title: "px" },
                { value: "%", title: "%" }
              ],
              inputMax: isSvgOrGif ? 100 : undefined
            }
          },
          {
            id: "height",
            label: t("Height"),
            type: "slider",
            disabled: !isCustomSizeType || isSvgOrGif,
            config: {
              min: 5,
              max: heightSuffixValue === "px" ? Math.round(cW * 2) : 100,
              units: imagePopulation
                ? [{ value: "px", title: "px" }]
                : [
                    { value: "px", title: "px" },
                    { value: "%", title: "%" }
                  ]
            }
          },
          {
            id: "size",
            label: t("Size"),
            type: "slider",
            disabled: isCustomSizeType || isSvgOrGif,
            config: {
              min: 5,
              max: 100,
              units: [{ value: "%", title: "%" }]
            }
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
      }
    ];
  };
