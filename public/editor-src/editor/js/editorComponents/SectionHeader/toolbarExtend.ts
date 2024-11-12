import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { getAllMembershipChoices } from "visual/utils/membership";
import { getLanguagesChoices } from "visual/utils/multilanguages";
import { defaultValueValue } from "visual/utils/onChange";
import * as Str from "visual/utils/reader/string";
import { capitalize } from "visual/utils/string";
import { getInstanceParentId } from "visual/utils/toolbar";
import { Toggle } from "visual/utils/options/utils/Type";
import { Value, Props, RenderType } from "./type";

export const getItems: GetItems<Value, Props> = ({ v, device, component }) => {
  const config = Config.getAll();
  const disabledSavedBlock =
    typeof config.api?.savedBlocks?.create !== "function";
  const disabledGlobalBlock =
    typeof config.api?.globalBlocks?.create !== "function";
  const globalBlockId = Str.read(component.props.meta.globalBlockId);
  const multilanguage: boolean = config.multilanguage === true;
  const membership: boolean = config.membership === true;

  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const deviceCapitalize = capitalize(device);

  return [
    {
      id: `showOn${deviceCapitalize}`,
      type: "showOnDevice",
      closeTooltip: true,
      devices: "responsive",
      position: 9,
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
            { title: t("Static"), value: RenderType.Static },
            { title: t("Fixed"), value: RenderType.Fixed },
            { title: t("Sticky"), value: RenderType.Animated }
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
