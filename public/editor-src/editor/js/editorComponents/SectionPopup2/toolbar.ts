import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import {
  MaskPositions,
  MaskRepeat,
  MaskShapes,
  MaskSizes
} from "visual/utils/mask/Mask";
import { isPopup } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { read as readString } from "visual/utils/reader/string";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { getInstanceParentId } from "visual/utils/toolbar";
import { Value } from "./toolbarClose";

// @ts-expect-error need to change to new options
export const getItems: GetItems<Value> = ({
  v,
  device,
  component,
  context
}) => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const widthSuffix = dvv("widthSuffix");
  const columnsHeightStyle = dvv("columnsHeightStyle");

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

  const config = Config.getAll();

  const popupSettings = config.ui?.popupSettings ?? {};
  const IS_GLOBAL_POPUP = isPopup(config);

  const enableDisplayCondition = popupSettings.displayCondition;
  const enableDelete = popupSettings.deletePopup;
  const enabledEmbedded = popupSettings.embedded === true;
  const enabledHorizontalAlign = popupSettings.horizontalAlign === true;
  const enabledVerticalAlign = popupSettings.verticalAlign === true;
  const enableScrollPageBehind = popupSettings.scrollPageBehind === true;
  const enableclickOutsideToClose = popupSettings.clickOutsideToClose === true;

  const blockType = IS_GLOBAL_POPUP ? "externalPopup" : "popup";

  const columnsHeightStylePicker =
    columnsHeightStyle === "custom"
      ? [
          { title: t("Auto"), value: "auto" },
          { title: t("Height"), value: "custom" },
          { title: t("Custom"), value: "custom2" },
          { title: t("Full Height"), value: "fullHeight" }
        ]
      : [
          { title: t("Auto"), value: "auto" },
          { title: t("Custom"), value: "custom2" },
          { title: t("Full Height"), value: "fullHeight" }
        ];

  const maskShape = readString(dvv("maskShape")) ?? "none";
  const maskPosition = readString(dvv("maskPosition")) ?? "center center";
  const maskSize = readString(dvv("maskSize")) ?? "cover";
  const maskScaleSuffix = readString(dvv("maskScaleSuffix")) ?? "%";
  const maskCustomUploadImageSrc = readString(dvv("maskCustomUploadImageSrc"));
  const maskShapeIsDisabled =
    maskShape === "none" ||
    (maskShape === "custom" && !maskCustomUploadImageSrc);

  return [
    {
      id: "toolbarPopup",
      type: "popover-dev",
      config: {
        icon: "nc-popup",
        title: "Popup"
      },
      position: 70,
      devices: "desktop",
      disabled: IS_GLOBAL_POPUP && enabledEmbedded,
      options: [
        {
          id: "tabsPopup",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabPopup",
              label: t("Popup"),
              options: [
                {
                  id: "makeItGlobal",
                  label: t("Make it Global"),
                  type: "globalBlock-dev",
                  devices: "desktop",
                  disabled: isCloud(config) && isShopify(config),
                  config: {
                    _id: component.getId(),
                    parentId: getInstanceParentId(
                      component.props.instanceKey,
                      blockType
                    ),
                    blockType
                  }
                },
                {
                  id: "scrollPage",
                  label: t("Scroll Page Behind"),
                  type: "switch-dev",
                  disabled: !enableScrollPageBehind,
                  position: 100
                },
                {
                  id: "popupConditions",
                  type: "popupConditions",
                  disabled: !enableDisplayCondition,
                  position: 150
                }
              ]
            },
            {
              id: "tabClose",
              label: t("Close"),
              options: [
                {
                  id: "clickOutsideToClose",
                  label: t("Click Outside to Close"),
                  type: "switch-dev",
                  disabled: !enableclickOutsideToClose
                },
                {
                  id: "groupShowCloseButton",
                  type: "group-dev",
                  options: [
                    {
                      id: "showCloseButton",
                      label: t("Display Close Button"),
                      type: "switch-dev"
                    },
                    {
                      id: "showCloseButtonAfter",
                      label: t("Delay"),
                      type: "slider-dev",
                      disabled: dvv("showCloseButton") !== "on",
                      config: {
                        min: 0,
                        max: 10,
                        units: [{ title: "s", value: "s" }]
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarMedia",
      type: "popover-dev",
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 80,
      options: [
        {
          id: "tabsMedia",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabMedia",
              label: t("Image"),
              options: [
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload-dev",
                  population: imageDynamicContentChoices
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
                  type: "select-dev",
                  choices: MaskShapes
                },
                {
                  id: "maskCustomUpload",
                  type: "imageUpload-dev",
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
                  type: "group-dev",
                  disabled: maskShapeIsDisabled,
                  options: [
                    {
                      id: "maskSize",
                      label: t("Size"),
                      type: "select-dev",
                      choices: MaskSizes
                    },
                    {
                      id: "maskScale",
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
                      id: "maskPosition",
                      type: "select-dev",
                      label: t("Position"),
                      choices: MaskPositions
                    },
                    {
                      id: "maskPositionx",
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
                      id: "maskPositiony",
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
                  id: "maskRepeat",
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
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
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
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBgColor",
              label: t("Background"),
              options: [
                {
                  id: "",
                  type: "backgroundColor-dev"
                }
              ]
            },
            {
              id: "tabDropShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "maskShadow",
                  type: "textShadow-dev",
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
      type: "savedBlock-dev",
      devices: "desktop",
      position: 90,
      config: {
        icon: "nc-save-section",
        blockType: "popup",
        title: t("Save"),
        tooltipContent: t("Saved"),
        blockId: component.getId()
      }
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: !enabledHorizontalAlign,
      position: 90,
      choices: [
        { icon: "nc-hrz-align-left", title: t("Align"), value: "left" },
        { icon: "nc-hrz-align-center", title: t("Align"), value: "center" },
        { icon: "nc-hrz-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "verticalAlign",
      type: "toggle-dev",
      disabled: columnsHeightStyle === "fullHeight" || !enabledVerticalAlign,
      position: 100,
      choices: [
        { icon: "nc-ver-align-top", title: t("Align"), value: "top" },
        { icon: "nc-ver-align-middle", title: t("Align"), value: "center" },
        { icon: "nc-ver-align-bottom", title: t("Align"), value: "bottom" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          position: 100,
          config: {
            min: widthSuffix === "px" ? 200 : 20,
            max: widthSuffix === "px" ? 1170 : 100,
            units: [
              { title: "px", value: "px" },
              { title: "%", value: "%" }
            ]
          }
        },
        {
          id: "groupHeight",
          type: "group-dev",
          position: 100,
          options: [
            {
              id: "columnsHeightStyle",
              label: t("Height"),
              type: "select-dev",
              choices: columnsHeightStylePicker
            },
            {
              id: "columnsHeight",
              type: "slider-dev",
              disabled: !(
                columnsHeightStyle === "custom" ||
                columnsHeightStyle === "custom2"
              ),
              config: {
                min: 20,
                max: dvv("columnsHeightSuffix") === "px" ? 500 : 100,
                units: [
                  { title: "px", value: "px" },
                  { title: "%", value: "vh" }
                ]
              }
            }
          ]
        },
        {
          id: "popupRowVerticalAlign",
          label: t("Content"),
          type: "radioGroup-dev",
          devices: "desktop",
          disabled: dvv("columnsHeightStyle") === "auto",
          position: 110,
          choices: [
            { value: "top", icon: "nc-align-top" },
            { value: "center", icon: "nc-align-middle" },
            { value: "bottom", icon: "nc-align-bottom" }
          ]
        },
        {
          id: "styles",
          type: "sidebarTabsButton-dev",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    },
    {
      id: "remove",
      type: "button",
      disabled: !enableDelete,
      title: t("Delete"),
      icon: "nc-trash",
      position: 250,
      onChange: () => {
        // @ts-expect-error old options
        component.handleDropClick();
      }
    }
  ];
};
