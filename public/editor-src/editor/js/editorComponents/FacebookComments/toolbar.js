import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";

import { NORMAL, HOVER } from "visual/utils/stateMode";

const wordpress = Boolean(Config.get("wp"));

export function getItems({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  const choicesType = wordpress
    ? [
        { title: t("Facebook"), value: "facebook" },
        { title: t("Disqus"), value: "disqus" },
        { title: t("WordPress"), value: "WPComments" }
      ]
    : [
        { title: t("Facebook"), value: "facebook" },
        { title: t("Disqus"), value: "disqus" }
      ];

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-comments",
        title: t("Comments")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "type",
          type: "select-dev",
          label: t("Comments"),
          devices: "desktop",
          choices: choicesType
        },
        {
          id: "skin",
          label: t("Skin"),
          type: "select-dev",
          disabled: v.type !== "WPComments",
          devices: "desktop",
          choices: [
            { title: t("Skin 1"), value: "skin1" },
            { title: t("Skin 2"), value: "skin2" },
            { title: t("Skin 3"), value: "skin3" },
            { title: t("Skin 4"), value: "skin4" }
          ]
        },
        {
          id: "numPosts",
          label: t("Posts"),
          type: "slider-dev",
          disabled: v.type !== "facebook" && v.type !== "WPComments",
          devices: "desktop",
          config: {
            min: 5,
            max: 20,
            debounceUpdate: true
          }
        },
        // {
        //   id: "darkScheme",
        //   type: "switch-dev",
        //   label: t("Dark Scheme")
        // },
        {
          id: "disqusShortname",
          type: "inputText-dev",
          label: t("Shortname"),
          disabled: v.type !== "disqus",
          devices: "desktop",
          placeholder: "shortname"
        },
        {
          id: "logoSize",
          label: t("Avatar"),
          type: "slider-dev",
          disabled: v.type !== "WPComments",
          config: {
            min: 10,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabTypographyName",
              label: t("Name"),
              options: [
                {
                  id: "name",
                  type: "typography-dev",
                  disabled: v.type !== "WPComments",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabTypographyComment",
              label: t("Comment"),
              options: [
                {
                  id: "comment",
                  type: "typography-dev",
                  disabled: v.type !== "WPComments",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabTypographyDate",
              label: t("Date"),
              options: [
                {
                  id: "date",
                  type: "typography-dev",
                  disabled: v.type !== "WPComments",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabTypographyReply",
              label: t("Reply"),
              options: [
                {
                  id: "reply",
                  type: "typography-dev",
                  disabled: v.type !== "WPComments",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabTypographyPostButton",
              label: t("Button"),
              options: [
                {
                  id: "postButton",
                  type: "typography-dev",
                  disabled: v.type !== "WPComments",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(borderColorHex, v.borderColorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          config: {
            showSingle: true
          },
          tabs: [
            {
              id: "tabNameColor",
              label: t("Name"),
              options: [
                {
                  id: "nameColor",
                  disabled: v.type !== "WPComments",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabCommentsColor",
              label: t("Comments"),
              options: [
                {
                  id: "commentsColor",
                  disabled: v.type !== "WPComments",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabPostButtonColor",
              label: t("Btn Color"),
              options: [
                {
                  id: "postButtonColor",
                  type: "colorPicker-dev",
                  disabled: v.type !== "WPComments",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabPostButtonBg",
              label: t("Btn Bg"),
              options: [
                {
                  id: "postButtonBgColor",
                  type: "colorPicker-dev",
                  disabled: v.type !== "WPComments",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarLink",
      type: "popover-dev",
      config: {
        icon: "nc-link",
        title: t("Link"),
        size: "medium"
      },
      position: 90,
      options: [
        {
          id: "targetUrl",
          label: t("Target URL"),
          type: "select-dev",
          devices: "desktop",
          choices: [
            {
              title: t("Current Page"),
              value: "current"
            },
            {
              title: t("Custom Page"),
              value: "custom"
            }
          ]
        },
        {
          id: "href",
          label: t("Link"),
          type: "inputText-dev",
          placeholder: "http://",
          disabled: dvv("targetUrl") === "current",
          devices: "desktop"
        }
      ]
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
