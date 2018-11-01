import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      icon: "nc-star",
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Icon"),
              options: [
                {
                  id: "iconPosition",
                  label: t("Position"),
                  type: "radioGroup",
                  roles: ["admin"],
                  position: 50,
                  choices: [
                    {
                      value: "left",
                      icon: "nc-align-left"
                    },
                    {
                      value: "right",
                      icon: "nc-align-right"
                    }
                  ],
                  value: v.iconPosition
                },
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider",
                  roles: ["admin"],
                  slider: {
                    min: 0,
                    max: 100
                  },
                  input: {
                    show: true
                  },
                  suffix: {
                    show: true,
                    choices: [
                      {
                        title: "px",
                        value: "px"
                      }
                    ]
                  },
                  position: 70,
                  value: {
                    value: v.iconSpacing
                  },
                  onChange: ({ value: iconSpacing }) => {
                    return {
                      iconSpacing
                    };
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      disabled: true
    },
    {
      id: "toolbarLink",
      type: "popover",
      disabled: true
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true
    }
  ];
}

export function getItemsForTablet(v) {
  return [
    {
      id: "showOnTablet",
      type: "toggle",
      disabled: true
    },
    {
      id: "tabletHorizontalAlign",
      type: "toggle",
      disabled: true
    },
    {
      id: "tabletToolbarSettings",
      type: "popover",
      options: [
        {
          id: "tabletAdvancedSettings",
          type: "advancedSettings",
          disabled: true
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "showOnMobile",
      type: "toggle",
      disabled: true
    },
    {
      id: "mobileHorizontalAlign",
      type: "toggle",
      disabled: true
    },
    {
      id: "mobileToolbarSettings",
      type: "popover",
      options: [
        {
          id: "mobileAdvancedSettings",
          type: "advancedSettings",
          disabled: true
        }
      ]
    }
  ];
}
