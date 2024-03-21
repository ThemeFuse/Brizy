import { isEmpty } from "underscore";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { getAllMembershipChoices } from "visual/utils/membership";
import { getLanguagesChoices } from "visual/utils/multilanguages";
import { defaultValueValue } from "visual/utils/onChange";
import * as Str from "visual/utils/reader/string";
import { toolbarShowOnResponsive } from "visual/utils/toolbar";
import { getInstanceParentId } from "visual/utils/toolbar";

export const getItems: GetItems = ({ v, device, component }) => {
  const config = Config.getAll();
  const disabledSavedBlock =
    typeof config.api?.savedBlocks?.create !== "function";
  const disabledGlobalBlock =
    typeof config.api?.globalBlocks?.create !== "function";

  const multilanguage: boolean = config.multilanguage === true;
  const membership: boolean = config.membership === true;

  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const globalBlockId = Str.read(component.props.meta.globalBlockId);

  const showOnResponsive = toolbarShowOnResponsive({
    v,
    device,
    devices: "responsive",
    closeTooltip: true
  });

  return [
    ...(isEmpty(showOnResponsive) ? [] : [showOnResponsive as ToolbarItemType]),
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
              choices: getAllMembershipChoices(config)
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
              choices: getLanguagesChoices(config)
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
    }
  ];
};
