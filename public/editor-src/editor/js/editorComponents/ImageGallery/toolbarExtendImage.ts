import { t } from "visual/utils/i18n";
import {
  MaskPositions,
  MaskRepeat,
  MaskShapes,
  MaskSizes
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
    (maskShape === "custom" && !maskCustomUploadImageSrc);

  return [
    {
      id: "toolbarImage",
      type: "popover-dev",
      config: {
        icon: "nc-img",
        title: t("Image")
      },
      position: 80,
      options: [
        {
          id: "media",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabImage",
              label: t("Image"),
              options: [
                {
                  id: "thumbStyle",
                  label: t("Style"),
                  type: "radioGroup-dev",
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
                  type: "select-dev",
                  choices: MaskShapes
                },
                {
                  id: "imagesMaskCustomUpload",
                  type: "imageUpload-dev",
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
                  disabled: maskShape !== "custom"
                },
                {
                  id: "groupSize",
                  type: "group-dev",
                  disabled: maskShapeIsDisabled,
                  options: [
                    {
                      id: "imagesMaskSize",
                      label: t("Size"),
                      type: "select-dev",
                      choices: MaskSizes
                    },
                    {
                      id: "imagesMaskScale",
                      type: "slider-dev",
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
                  type: "group-dev",
                  disabled: maskShapeIsDisabled,
                  options: [
                    {
                      id: "imagesMaskPosition",
                      type: "select-dev",
                      label: t("Position"),
                      choices: MaskPositions
                    },
                    {
                      id: "imagesMaskPositionx",
                      label: t("X"),
                      type: "slider-dev",
                      disabled: maskPosition !== "custom",
                      config: {
                        min: 1,
                        max: 100,
                        units: [{ value: "%", title: "%" }]
                      }
                    },
                    {
                      id: "imagesMaskPositiony",
                      label: t("Y"),
                      type: "slider-dev",
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
                  id: "imagesMaskRepeat",
                  label: t("Repeat"),
                  type: "select-dev",
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
      id: "toolbarGallerySettings",
      type: "popover-dev",
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
          type: "slider-dev",
          disabled: v.thumbStyle !== "left" && v.thumbStyle !== "right",
          config: {
            min: 0,
            max: 300,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "bigImageImagesHeight",
          type: "slider-dev",
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
          type: "slider-dev",
          label: t("Spacing"),
          config: {
            min: 0,
            max: 20,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "bigImageSpacing",
          type: "slider-dev",
          label: t("Indent"),
          disabled: layout !== "bigImage",
          config: {
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "styles",
          type: "sidebarTabsButton-dev",
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
