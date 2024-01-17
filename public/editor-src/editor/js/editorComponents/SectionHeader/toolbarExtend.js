import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";
import { t } from "visual/utils/i18n";
import { getAllMembershipChoices } from "visual/utils/membership";
import { getLanguagesChoices } from "visual/utils/multilanguages";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarShowOnResponsive } from "visual/utils/toolbar";
import { getInstanceParentId } from "visual/utils/toolbar";

export function getItems({ v, device, component }) {
  const config = Config.getAll();
  const disabledSavedBlock =
    typeof config.api?.savedBlocks?.create !== "function";

  const isMultiLanguageDisabled =
    config.elements?.header?.multilanguage === false;

  const dvv = (key) => defaultValueValue({ v, key, device });

  return [
    toolbarShowOnResponsive({
      v,
      device,
      devices: "responsive",
      closeTooltip: true
    }),
    {
      id: "toolbarSticky",
      type: "popover",
      config: {
        icon: "nc-sticky-menu",
        title: t("Menu")
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "type",
          label: t("Header"),
          type: "select",
          devices: "desktop",
          choices: [
            { title: t("Static"), value: "static" },
            { title: t("Fixed"), value: "fixed" },
            { title: t("Sticky"), value: "animated" }
          ]
        },
        {
          id: "groupSettings",
          type: "group",
          options: [
            {
              id: "makeItGlobal",
              label: t("Make it Global"),
              type: "globalBlock",
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
              type: "legacy-gbConditions",
              context: "block"
            }
          ]
        },
        {
          id: "membershipGroup",
          type: "group",
          disabled: isCloud(config) && isShopify(config),
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
              choices: getAllMembershipChoices(config)
            }
          ]
        },
        {
          id: "translationsGroup",
          type: "group",
          disabled: isWp(config),
          options: [
            {
              id: "translations",
              label: t("Multi-Language"),
              type: "switch",
              disabled: isMultiLanguageDisabled
            },
            {
              id: "translationsLangs",
              label: t("Show If Language"),
              type: "multiSelect",
              placeholder: t("Select"),
              disabled: dvv("translations") === "off",
              choices: getLanguagesChoices(config)
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
      disabled: disabledSavedBlock,
      config: {
        icon: "nc-save-section",
        blockType: "normal",
        title: t("Save"),
        tooltipContent: t("Saved"),
        blockId: component.getId()
      }
    }
  ];
}
