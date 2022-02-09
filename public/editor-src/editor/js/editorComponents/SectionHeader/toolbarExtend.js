import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import {
  toolbarElementSectionGlobal,
  toolbarElementSectionSaved,
  toolbarShowOnResponsive
} from "visual/utils/toolbar";
import { getAllMembershipChoices } from "visual/utils/membership";

export function getItems({ v, device, component }) {
  const config = Config.getAll();

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
          id: "membershipGroup",
          type: "group-dev",
          options: [
            {
              id: "membership",
              label: t("Membership"),
              type: "switch-dev"
            },
            {
              id: "membershipRoles",
              label: t("Show to"),
              type: "multiSelect2-dev",
              placeholder: "Select",
              disabled: v.membership === "off",
              choices: getAllMembershipChoices(config)
            }
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
