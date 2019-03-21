import { t } from "visual/utils/i18n";
import { toolbarCustomCSS } from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      icon: "nc-facebook",
      title: t("Embed"),
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Embed"),
              options: [
                {
                  id: "type",
                  type: "select",
                  label: t("Embed"),
                  choices: [
                    {
                      title: t("Post"),
                      value: "post"
                    },
                    {
                      title: t("Video"),
                      value: "video"
                    }
                  ],
                  value: v.type
                },
                {
                  id: "postAndVideoShowText",
                  label: t("Include Full Post"),
                  type: "switch",
                  value: v.postAndVideoShowText
                }
              ]
            },
            {
              id: "advanced",
              label: t("Advanced"),
              disabled: v.type === "video" ? false : true,
              options: [
                {
                  id: "videoAllowFullScreen",
                  label: t("Full Screen"),
                  type: "switch",
                  value: v.videoAllowFullScreen
                },
                {
                  id: "videoAutoPlay",
                  label: t("AutoPlay"),
                  type: "switch",
                  value: v.videoAutoPlay
                },
                {
                  id: "videoCaptions",
                  label: t("Captions"),
                  type: "switch",
                  value: v.videoCaptions
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
          id: "postHref",
          label: t("Link"),
          type: "input",
          disabled: v.type === "post" ? false : true,
          placeholder: t("Link"),
          value: {
            value: v.postHref
          },
          onChange: ({ value: postHref }) => ({
            postHref
          })
        },
        {
          id: "videoHref",
          label: t("Link"),
          type: "input",
          disabled: v.type === "video" ? false : true,
          placeholder: t("Link"),
          value: {
            value: v.videoHref
          },
          onChange: ({ value: videoHref }) => ({
            videoHref
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
                  options: [toolbarCustomCSS({ v })]
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
