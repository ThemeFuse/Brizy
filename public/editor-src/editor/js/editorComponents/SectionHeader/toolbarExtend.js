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
    },
    {
      id: "toolbarSettings",
      type: "popover",
      position: 110,
      options: [
        {
          id: "advancedSettings",
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              align: "start",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Styling"),
                  tabIcon: "nc-styling",
                  options: []
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [
                    {
                      id: "anchorName",
                      label: t("Anchor Name"),
                      type: "input",
                      inputSize: "auto",
                      position: 10,
                      value: {
                        value: v.anchorName
                      },
                      onChange: ({ value: anchorName }) => ({
                        anchorName
                      })
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  return [];
}

export function getItemsForMobile(v) {
  return [];
}
