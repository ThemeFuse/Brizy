import { GetItems } from "visual/editorComponents/EditorComponent/types";
import {
  getMaxContainerSuffix,
  getMinContainerSuffix
} from "visual/editorComponents/Section/utils";
import { Cloud } from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isBackgroundPointerEnabled } from "visual/global/Config/types/configs/featuresValue";
import { getColor } from "visual/utils/color";
import { BgRepeat, BgSize } from "visual/utils/containers/types";
import { t } from "visual/utils/i18n";
import { ImageType } from "visual/utils/image/types";
import {
  getMaskPositions,
  getMaskRepeat,
  getMaskShapes,
  getMaskSizes
} from "visual/utils/mask/Mask";
import { getAllMembershipChoices } from "visual/utils/membership";
import { getLanguagesChoices } from "visual/utils/multilanguages";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { Toggle } from "visual/utils/options/utils/Type";
import * as Str from "visual/utils/reader/string";
import { read as readString } from "visual/utils/reader/string";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { capitalize } from "visual/utils/string";
import { getInstanceParentId } from "visual/utils/toolbar";


export const getItems: GetItems = ({ v, device, component, context }) => {
  const config = component.getGlobalConfig();
  const disabledSavedBlock =
    typeof config.api?.savedBlocks?.create !== "function";
  const disabledGlobalBlock =
    typeof config.api?.globalBlocks?.create !== "function";

  const multilanguage: boolean = config.multilanguage === true;
  const membership: boolean = config.membership === true;

  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });
  const sectionHeightSuffix = dvv("sectionHeightSuffix");

  const bgColor = getColor(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );
  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

  const maskShape = readString(dvv("maskShape")) ?? "none";
  const maskPosition = readString(dvv("maskPosition")) ?? "center center";
  const maskSize = readString(dvv("maskSize")) ?? "cover";
  const maskScaleSuffix = readString(dvv("maskScaleSuffix")) ?? "%";
  const maskCustomUploadImageSrc = readString(dvv("maskCustomUploadImageSrc"));
  const maskShapeIsDisabled =
    maskShape === "none" ||
    (maskShape === "custom" && !maskCustomUploadImageSrc);
  const isExternalImage = dvv("bgImageType") !== ImageType.Internal;
  const isPointerEnabled = isBackgroundPointerEnabled(config, "sectionFooter");
  const globalBlockId = Str.read(component.props.meta.globalBlockId);
  const imageMedia = dvv("media") === "image";
  const coverBg = dvv("bgSize") === BgSize.Cover;
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
      id: "toolbarFooter",
      type: "popover",
      config: {
        icon: "nc-footer",
        title: t("Footer")
      },
      position: 70,
      devices: "desktop",
      options: [
        {
          id: "groupSettings",
          type: "group",
          disabled: disabledGlobalBlock,
          options: [
            {
              id: "makeItGlobal",
              label: t("Make it Global"),
              type: "globalBlock",
              devices: "desktop",
              config: {
                _id: component.getId(),
                parentId: getInstanceParentId(component.props.instanceKey),
                blockType: "normal"
              }
            },
            {
              id: "gbConditions",
              disabled: !globalBlockId,
              config: {
                globalBlockId: globalBlockId as string
              },
              type: "gbCondition",
              context: "block"
            }
          ]
        },
        {
          id: "membershipGroup",
          type: "group",
          disabled: !membership,
          options: [
            {
              id: "membership",
              label: t("Membership"),
              type: "switch"
            },
            {
              id: "membershipRoles",
              label: t("Show to"),
              type: "multiSelect",
              placeholder: t("Select"),
              disabled: dvv("membership") === "off",
              choices: getAllMembershipChoices(config as Cloud)
            }
          ]
        },
        {
          id: "translationsGroup",
          type: "group",
          disabled: !multilanguage,
          options: [
            {
              id: "translations",
              label: t("Multi-Language"),
              type: "switch"
            },
            {
              id: "translationsLangs",
              label: t("Show If Language"),
              type: "multiSelect",
              placeholder: t("Select"),
              disabled: dvv("translations") === "off",
              choices: getLanguagesChoices(config as Cloud)
            }
          ]
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
              label: t("Image"),
              options: [
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload",
                  states: [NORMAL, HOVER],
                  population: imageDynamicContentChoices,
                  config: {
                    disableSizes: isExternalImage,
                    pointer: !isExternalImage && isPointerEnabled
                  }
                },
                {
                  choices: [
                    { title: t("Cover"), value: BgSize.Cover },
                    { title: t("Contain"), value: BgSize.Contain },
                    { title: t("Auto"), value: BgSize.Auto }
                  ],
                  disabled: !imageMedia,
                  id: "bgSize",
                  label: t("Size"),
                  type: "select"
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
                  choices: getMaskShapes()
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
                  disabled: maskShape !== "custom"
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
      id: "makeItSaved",
      type: "savedBlock",
      devices: "desktop",
      position: 90,
      disabled: disabledSavedBlock,
      config: {
        icon: "nc-save-section",
        blockType: "normal",
        title: t("Save"),
        tooltipContent: t("Saved"),
        blockId: component.getId()
      }
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
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
          id: "toolbarContainerTypeAndHeight",
          type: "group",
          devices: "desktop",
          position: 100,
          options: [
            {
              id: "fullHeight",
              label: t("Height"),
              type: "select",
              choices: [
                { title: t("Auto"), value: "off" },
                { title: t("Custom"), value: "custom" },
                { title: t("Full Height"), value: "on" }
              ]
            },
            {
              id: "sectionHeight",
              type: "slider",
              disabled: dvv("fullHeight") !== "custom",
              config: {
                min: 20,
                max: sectionHeightSuffix === "px" ? 500 : 100,
                units: [
                  { title: "px", value: "px" },
                  { title: "%", value: "vh" }
                ]
              }
            }
          ]
        },
        {
          id: "verticalAlign",
          label: t("Content"),
          type: "radioGroup",
          devices: "desktop",
          disabled: dvv("fullHeight") === "off",
          position: 110,
          choices: [
            { value: "top", icon: "nc-align-top" },
            { value: "center", icon: "nc-align-middle" },
            { value: "bottom", icon: "nc-align-bottom" }
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
