import {
  getMaxContainerSuffix,
  getMinContainerSuffix
} from "visual/editorComponents/Section/utils";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { getAllMembershipChoices } from "visual/utils/membership";
import { getLanguagesChoices } from "visual/utils/multilanguages";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarShowOnResponsive } from "visual/utils/toolbar";
import { getInstanceParentId } from "visual/utils/toolbar";

export function getItems({ v, device, component, context }) {
  const config = Config.getAll();
  const isMultiLanguageDisabled =
    config.elements?.footer?.multilanguage === false;

  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });
  const sectionHeightSuffix = dvv("sectionHeightSuffix");

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const imageDynamicContentChoices = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.image
  });

  return [
    toolbarShowOnResponsive({
      v,
      device,
      devices: "responsive",
      closeTooltip: true
    }),
    {
      id: "toolbarFooter",
      type: "popover-dev",
      config: {
        icon: "nc-footer",
        title: t("Footer")
      },
      position: 70,
      devices: "desktop",
      options: [
        {
          id: "groupSettings",
          type: "group-dev",
          options: [
            {
              id: "makeItGlobal",
              label: t("Make it Global"),
              type: "globalBlock-dev",
              devices: "desktop",
              disabled: isCloud(config) && isShopify(config),
              config: {
                _id: component.getId(),
                parentId: getInstanceParentId(component.props.instanceKey),
                blockType: "normal"
              }
            },
            {
              id: "gbConditions",
              disabled: !component.props.meta.globalBlockId,
              value: component.props.meta.globalBlockId,
              type: "gbConditions",
              context: "block"
            }
          ]
        },
        {
          id: "membershipGroup",
          type: "group-dev",
          disabled: isCloud(config) && isShopify(config),
          options: [
            {
              id: "membership",
              label: t("Membership"),
              type: "switch-dev"
            },
            {
              id: "membershipRoles",
              label: t("Show to"),
              type: "multiSelect-dev",
              placeholder: "Select",
              disabled: dvv("membership") === "off",
              choices: getAllMembershipChoices(config)
            }
          ]
        },
        {
          id: "translationsGroup",
          type: "group-dev",
          disabled: isWp(config),
          options: [
            {
              id: "translations",
              label: t("Multi-Language"),
              type: "switch-dev",
              disabled: isMultiLanguageDisabled
            },
            {
              id: "translationsLangs",
              label: t("Show If Language"),
              type: "multiSelect-dev",
              placeholder: "Select",
              disabled: dvv("translations") === "off",
              choices: getLanguagesChoices(config)
            }
          ]
        }
      ]
    },
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 80,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Image"),
              options: [
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload-dev",
                  states: [NORMAL, HOVER],
                  population: imageDynamicContentChoices
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
              id: "tabOverlay",
              label: t("Overlay"),
              options: [
                {
                  id: "",
                  type: "backgroundColor-dev",
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
                  type: "border-dev",
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
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER]
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
        blockType: "normal",
        title: t("Save"),
        tooltipContent: t("Saved"),
        blockId: component.getId()
      }
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "containerTypeGroup",
          type: "group-dev",
          position: 10,
          options: [
            {
              id: "containerType",
              label: t("Width"),
              devices: "desktop",
              type: "select-dev",
              choices: [
                { title: t("Boxed"), value: "boxed" },
                { title: t("Full"), value: "fullWidth" }
              ]
            },
            {
              id: "containerSize",
              label: device === "desktop" ? "" : t("Width"),
              type: "slider-dev",
              disabled: dvv("containerType") !== "boxed",
              config: {
                min: getMinContainerSuffix({ v, device }),
                max: getMaxContainerSuffix({ v, device }),
                units: [
                  { title: "px", value: "px" },
                  { title: "%", value: "%" }
                ]
              }
            }
          ]
        },
        {
          id: "toolbarContainerTypeAndHeight",
          type: "group-dev",
          devices: "desktop",
          position: 100,
          options: [
            {
              id: "fullHeight",
              label: t("Height"),
              type: "select-dev",
              choices: [
                { title: t("Auto"), value: "off" },
                { title: t("Custom"), value: "custom" },
                { title: t("Full Height"), value: "on" }
              ]
            },
            {
              id: "sectionHeight",
              type: "slider-dev",
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
          type: "radioGroup-dev",
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
          separator: true,
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
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
                  type: "sidebarTabsButton-dev",
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
