import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v, component) {
  return [
    {
      id: "toolbarSticky",
      type: "popover",
      icon: "nc-sticky-menu",
      title: t("Menu"),
      position: 10,
      options: [
        {
          id: "type",
          label: t("Header"),
          type: "select",
          choices: [
            {
              title: t("Static"),
              value: "static"
            },
            {
              title: t("Fixed"),
              value: "fixed"
            },
            {
              title: t("Sticky"),
              value: "animated"
            }
          ],
          value: v.type
        },
        {
          id: "makeItGlobal",
          label: t("Make it Global"),
          type: "switch",
          value: component.props.meta.globalBlockId ? "on" : "off",
          onChange: value => {
            value === "on"
              ? component.becomeGlobal()
              : component.becomeNormal();
          }
        }
      ]
    },
    {
      id: "makeItSaved",
      type: "buttonTooltip",
      icon: "nc-save-section",
      position: 100,
      title: t("Save"),
      tooltipContent: t("Saved"),
      onChange: () => {
        component.becomeSaved();
      }
    }
  ];
}

export function getItemsForTablet(v) {
  return [];
}

export function getItemsForMobile(v) {
  return [];
}
