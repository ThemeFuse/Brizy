import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { GetItems } from "../EditorComponent/types";
import type { Props, Value } from "./index";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state: "normal" });

  const { hex: galleryImageBorderColorHex } = getOptionColorHexByPalette(
    dvv("galleryImageBorderColorHex"),
    dvv("galleryImageBorderColorPallete")
  );

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
                  choices: [
                    { title: t("None"), value: "none" },
                    {
                      value: "circle",
                      icon: {
                        name: "nc-mask-shape-circle"
                      },
                      title: ""
                    },
                    {
                      value: "rhombus",
                      icon: {
                        name: "nc-mask-shape-rhombus"
                      },
                      title: ""
                    },
                    {
                      value: "star",
                      icon: {
                        name: "nc-mask-shape-star"
                      },
                      title: ""
                    },
                    {
                      value: "flower",
                      icon: {
                        name: "nc-mask-shape-flower"
                      },
                      title: ""
                    },
                    {
                      value: "square",
                      icon: {
                        name: "nc-mask-shape-square"
                      },
                      title: ""
                    },
                    {
                      value: "triangle",
                      icon: {
                        name: "nc-mask-shape-triangle"
                      },
                      title: ""
                    },
                    {
                      value: "blob1",
                      icon: { name: "nc-mask-shape-blob1" },
                      title: ""
                    },
                    {
                      value: "blob2",
                      icon: { name: "nc-mask-shape-blob2" },
                      title: ""
                    },
                    {
                      value: "blob3",
                      icon: { name: "nc-mask-shape-blob3" },
                      title: ""
                    },
                    {
                      value: "blob4",
                      icon: { name: "nc-mask-shape-blob4" },
                      title: ""
                    },
                    {
                      value: "brush1",
                      icon: {
                        name: "nc-mask-shape-brush1"
                      },
                      title: ""
                    },
                    {
                      value: "brush2",
                      icon: {
                        name: "nc-mask-shape-brush2"
                      },
                      title: ""
                    },
                    {
                      value: "brush3",
                      icon: {
                        name: "nc-mask-shape-brush3"
                      },
                      title: ""
                    },
                    {
                      value: "brush4",
                      icon: {
                        name: "nc-mask-shape-brush4"
                      },
                      title: ""
                    },
                    {
                      value: "poly1",
                      icon: { name: "nc-mask-shape-poly1" },
                      title: ""
                    },
                    {
                      value: "poly2",
                      icon: { name: "nc-mask-shape-poly2" },
                      title: ""
                    },
                    {
                      value: "poly3",
                      icon: { name: "nc-mask-shape-poly3" },
                      title: ""
                    },
                    {
                      value: "poly4",
                      icon: { name: "nc-mask-shape-poly4" },
                      title: ""
                    },
                    { value: "custom", title: t("Custom") }
                  ]
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
                      choices: [
                        { title: t("Fit"), value: "contain" },
                        { title: t("Fill"), value: "cover" },
                        { title: t("Custom"), value: "custom" }
                      ]
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
                      choices: [
                        { title: t("Center Center"), value: "center center" },
                        { title: t("Center Left"), value: "center left" },
                        { title: t("Center Right"), value: "center right" },
                        { title: t("Top Center"), value: "top center" },
                        { title: t("Top Right"), value: "top right" },
                        { title: t("Top Left"), value: "top left" },
                        { title: t("Bottom Center"), value: "bottom center" },
                        { title: t("Bottom Left"), value: "bottom left" },
                        { title: t("Bottom Right"), value: "bottom right" },
                        { title: t("Custom"), value: "custom" }
                      ]
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
                  choices: [
                    { title: t("No-Repeat"), value: "no-repeat" },
                    { title: t("Repeat"), value: "repeat" },
                    { title: t("Repeat-X"), value: "repeat-x" },
                    { title: t("Repeat-Y"), value: "repeat-y" },
                    { title: t("Space"), value: "space" },
                    { title: t("Round"), value: "round" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      disabled: true
    },
    {
      id: "toolbarGalleryImageColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              galleryImageBorderColorHex,
              dvv("galleryImageBorderColorOpacity")
            )
          }
        }
      },
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabOverlayImages",
              label: t("Overlay"),
              options: [
                {
                  id: "galleryImageOverlay",
                  type: "backgroundColor-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "galleryImageBorder",
                  type: "border-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "galleryImageBoxShadow",
                  type: "boxShadow-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
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
