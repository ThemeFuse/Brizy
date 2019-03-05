import { t } from "visual/utils/i18n";
import { toolbarCustomCSS } from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-facebook",
      title: t("Button"),
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Button"),
              options: [
                {
                  id: "type",
                  type: "select",
                  label: t("Type"),
                  choices: [
                    {
                      title: t("Like"),
                      value: "like"
                    },
                    {
                      title: t("Recommend"),
                      value: "recommend"
                    }
                  ],
                  value: v.type
                },
                {
                  id: "layout",
                  label: t("Layout"),
                  type: "select",
                  choices: [
                    {
                      title: t("Button"),
                      value: "button"
                    },
                    {
                      title: t("Boxed"),
                      value: "boxed"
                    }
                  ],
                  value: v.layout
                },
                {
                  id: "size",
                  label: t("Size"),
                  type: "radioGroup",
                  choices: [
                    {
                      icon: "nc-small",
                      value: "small"
                    },
                    {
                      icon: "nc-large",
                      value: "large"
                    }
                  ],
                  value: v.size
                },
                {
                  id: "share",
                  type: "switch",
                  label: t("Include Share Button"),
                  value: v.share
                }
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              disabled: v.layout === "boxed" ? true : false,
              options: [
                {
                  id: "showCounter",
                  type: "switch",
                  label: t("Show Button Counter"),
                  value: v.showCounter
                },
                {
                  id: "showFriends",
                  type: "switch",
                  label: t("Show Friends' Faces"),
                  value: v.showFriends
                },
                {
                  id: "darkScheme",
                  type: "switch",
                  label: t("Dark Scheme"),
                  value: v.darkScheme
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
    }
  ];
}

export function getItemsForTablet(v) {
  return [];
}

export function getItemsForMobile(v) {
  return [];
}
