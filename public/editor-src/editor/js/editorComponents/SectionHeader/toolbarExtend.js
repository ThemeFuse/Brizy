import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import {
  toolbarElementSectionGlobal,
  toolbarElementSectionSaved,
  toolbarShowOnResponsive
} from "visual/utils/toolbar";
import { IS_WP } from "visual/utils/models";

export function getItems({ v, device, component }) {
  const membershipRoles = Config.get("wp")?.availableRoles || [];

  return [
    toolbarShowOnResponsive({
      v,
      device,
      devices: "responsive",
      closeTooltip: true
    }),
    {
      id: "toolbarSticky",
      type: "popover-dev",
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
          type: "select-dev",
          devices: "desktop",
          choices: [
            { title: t("Static"), value: "static" },
            { title: t("Fixed"), value: "fixed" },
            { title: t("Sticky"), value: "animated" }
          ]
        },
        {
          id: "groupSettings",
          type: "group-dev",
          options: [
            toolbarElementSectionGlobal({
              device,
              component,
              state: "normal",
              devices: "desktop"
            }),
            {
              id: "gbConditions",
              disabled: !component.props.meta.globalBlockId,
              value: component.props.meta.globalBlockId,
              type: "gbConditions"
            }
          ]
        },
        {
          id: "membership",
          label: t("Membership"),
          type: "switch-dev",
          disabled: !IS_WP
        },
        {
          id: "membershipRoles",
          label: t("Show to"),
          type: "multiSelect-dev",
          placeholder: "Select",
          disabled: v.membership === "off" || !IS_WP,
          choices: [
            {
              title: "Not logged",
              value: "not_logged"
            },
            ...membershipRoles.map(({ role, name }) => ({
              title: name,
              value: role
            }))
          ]
        }
      ]
    },
    toolbarElementSectionSaved({
      device,
      component,
      state: "normal",
      devices: "desktop",
      blockType: "normal"
    })
  ];
}
