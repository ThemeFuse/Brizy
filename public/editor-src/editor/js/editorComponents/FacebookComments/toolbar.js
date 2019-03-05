import { t } from "visual/utils/i18n";
import { toolbarCustomCSS } from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-facebook",
      title: t("Comments"),
      position: 70,
      options: [
        {
          id: "numPosts",
          label: t("Posts"),
          type: "slider",
          slider: {
            min: 5,
            max: 20
          },
          input: {
            show: true,
            min: 5,
            max: 20
          },
          suffix: {
            show: false
          },
          value: {
            value: v.numPosts
          },
          onChange: ({ value: numPosts }, { sliderDragEnd }) => {
            return sliderDragEnd && { numPosts };
          }
        },
        {
          id: "darkScheme",
          type: "switch",
          label: t("Dark Scheme"),
          value: v.darkScheme
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
          id: "targetUrl",
          label: t("Target URL"),
          type: "select",
          choices: [
            {
              title: t("Current Page"),
              value: "current"
            },
            {
              title: t("Custom Page"),
              value: "custom"
            }
          ],
          value: v.targetUrl
        },
        {
          id: "href",
          label: t("Link"),
          type: "input",
          disabled: v.targetUrl === "current" ? true : false,
          placeholder: "http://",
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
    /*{
      id: "apps",
      type: "integrationsApps",
      position: 120,
      icon: "nc-extensions-2",
      value: {
        service: "facebook",
        group: "social"
      }
    }*/
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
