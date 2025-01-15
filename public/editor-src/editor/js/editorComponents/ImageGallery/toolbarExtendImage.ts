import { SizeType } from "visual/global/Config/types/configs/common";
import { t } from "visual/utils/i18n";
import {
  getMaskPositions,
  getMaskRepeat,
  getMaskShapes,
  getMaskSizes
} from "visual/utils/mask/Mask";
import { defaultValueValue } from "visual/utils/onChange";
import type { GetItems } from "../EditorComponent/types";
import type { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state: "normal" });

  const layout = dvv("layout");
  const maskShape = dvv("imagesMaskShape");
  const maskPosition = dvv("imagesMaskPosition");
  const maskSize = dvv("imagesMaskSize");
  const maskScaleSuffix = dvv("imagesMaskScaleSuffix");
  const maskCustomUploadImageSrc = dvv("imagesMaskCustomUploadImageSrc");
  const maskShapeIsDisabled =
    maskShape === "none" ||
    (maskShape === SizeType.custom && !maskCustomUploadImageSrc);

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
                {
                  id: "thumbStyle",
                  label: t("Style"),
                  type: "radioGroup",
                  disabled: layout !== "bigImage",
                  devices: "desktop",
                  position: 10,
                  choices: [
                    { value: "bottom", icon: "nc-woo-gallery-bottom" },
                    { value: "left", icon: "nc-woo-gallery-left" },
                    { value: "top", icon: "nc-woo-gallery-top" },
                    { value: "right", icon: "nc-woo-gallery-right" }
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
                  id: "imagesMaskShape",
                  label: t("Shape"),
                  devices: "desktop",
                  type: "select",
                  choices: getMaskShapes()
                },
                {
                  id: "imagesMaskCustomUpload",
                  type: "imageUpload",
                  devices: "desktop",
                  label: t("Image"),
                  config: {
                    pointer: false,
                    disableSizes: true,
                    acceptedExtensions: ["png", "svg"]
                  },
                  helper: {
                    enabled: true,
                    content: t("Upload only [ .png or .svg ]")
                  },
                  disabled: maskShape !== SizeType.custom
                },
                {
                  id: "groupSize",
                  type: "group",
                  disabled: maskShapeIsDisabled,
                  options: [
                    {
                      id: "imagesMaskSize",
                      label: t("Size"),
                      type: "select",
                      choices: getMaskSizes()
                    },
                    {
                      id: "imagesMaskScale",
                      type: "slider",
                      disabled: maskSize !== SizeType.custom,
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
                      id: "imagesMaskPosition",
                      type: "select",
                      label: t("Position"),
                      choices: getMaskPositions()
                    },
                    {
                      id: "imagesMaskPositionx",
                      label: t("X"),
                      type: "slider",
                      disabled: maskPosition !== SizeType.custom,
                      config: {
                        min: 1,
                        max: 100,
                        units: [{ value: "%", title: "%" }]
                      }
                    },
                    {
                      id: "imagesMaskPositiony",
                      label: t("Y"),
                      type: "slider",
                      disabled: maskPosition !== SizeType.custom,
                      config: {
                        min: 1,
                        max: 100,
                        units: [{ value: "%", title: "%" }]
                      }
                    }
                  ]
                },
                {
                  id: "imagesMaskRepeat",
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
      id: "toolbarGallerySettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      disabled: layout !== "bigImage",
      position: 110,
      options: [
        {
          id: "thumbWidth",
          label: t("Width"),
          type: "slider",
          disabled: v.thumbStyle !== "left" && v.thumbStyle !== "right",
          config: {
            min: 0,
            max: 300,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "bigImageImagesHeight",
          type: "slider",
          label: t("Height"),
          disabled: layout !== "bigImage",
          config: {
            units: [{ value: "px", title: "px" }],
            min: 100,
            max: 1000
          }
        },
        {
          id: "spacing",
          type: "slider",
          label: t("Spacing"),
          config: {
            min: 0,
            max: 20,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "bigImageSpacing",
          type: "slider",
          label: t("Indent"),
          disabled: layout !== "bigImage",
          config: {
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "styles",
          type: "sidebarTabsButton",
          devices: "desktop",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    }
  ];
};
