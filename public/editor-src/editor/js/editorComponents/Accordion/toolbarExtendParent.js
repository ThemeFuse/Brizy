import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarAccordion",
      type: "popover-dev",
      config: {
        icon: "nc-toggle",
        title: t("Accordion")
      },
      position: 80,
      options: [
        {
          id: "enableTags",
          label: t("Enable tags"),
          type: "switch-dev",
          devices: "desktop"
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings"),
      align: "left"
    }
  ];
}
