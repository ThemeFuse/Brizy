import { t } from "visual/utils/i18n";
import { toolbarCustomCSS } from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-facebook",
      title: t("Page"),
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Page"),
              options: [
                {
                  id: "pageTabs",
                  type: "select",
                  label: t("Tabs"),
                  choices: [
                    {
                      title: t("Timeline"),
                      value: "timeline"
                    },
                    {
                      title: t("Events"),
                      value: "events"
                    },
                    {
                      title: t("Messages"),
                      value: "messages"
                    }
                  ],
                  value: v.pageTabs
                },
                {
                  id: "height",
                  label: t("Height"),
                  type: "slider",
                  slider: {
                    min: 70,
                    max: 800
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
                  value: {
                    value: v.height
                  },
                  onChange: ({ value: height }, { sliderDragEnd }) => {
                    return sliderDragEnd && { height };
                  }
                }
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              type: "tabs",
              options: [
                {
                  id: "smallHeader",
                  label: t("Use Small Header"),
                  type: "switch",
                  value: v.smallHeader
                },
                {
                  id: "hideCover",
                  label: t("Hide Cover Photo"),
                  type: "switch",
                  value: v.hideCover
                },
                {
                  id: "showFacepile",
                  label: t("Show Friend's Faces"),
                  type: "switch",
                  value: v.showFacepile
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarLink",
      type: "popover",
      icon: "nc-link",
      title: t("Link"),
      position: 80,
      options: [
        {
          id: "href",
          label: t("Link"),
          type: "input",
          placeholder: "https://facebook.com/brizy.io",
          value: {
            value: v.href
          },
          onChange: ({ value: href }) => ({
            href
          })
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "advancedSettings",
          type: "advancedSettings",
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
                  options: []
                }
              ]
            }
          ]
        }
      ]
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
      id: "tabletHorizontalAlign",
      type: "toggle",
      disabled: true
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileHorizontalAlign",
      type: "toggle",
      disabled: true
    }
  ];
}
