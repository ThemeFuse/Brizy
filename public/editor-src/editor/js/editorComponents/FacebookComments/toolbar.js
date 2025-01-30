import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state, component }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const type = dvv("type");

  const review = dvv("review") === "true";
  const WPComments = type !== "WPComments";

  const borderColor = getColorToolbar(
    dvv("borderColorPalette"),
    dvv("borderColorHex"),
    dvv("borderColorOpacity")
  );

  const choicesType = component.getGlobalConfig().wp
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
      type: "popover",
      config: {
        icon: review ? "nc-woo-review" : "nc-comments",
        title: review ? t("Review") : t("Comments")
      },
      position: 70,
      options: [
        {
          id: "type",
          type: "select",
          label: t("Comments"),
          devices: "desktop",
          disabled: review,
          choices: choicesType
        },
        {
          id: "skin",
          label: t("Skin"),
          type: "select",
          disabled: WPComments,
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
          type: "slider",
          disabled: type !== "facebook" && WPComments,
          devices: "desktop",
          config: {
            min: 5,
            max: 20,
            debounceUpdate: true
          }
        },
        // {
        //   id: "darkScheme",
        //   type: "switch",
        //   label: t("Dark Scheme")
        // },
        {
          id: "disqusShortname",
          type: "inputText",
          label: t("Shortname"),
          disabled: type !== "disqus",
          devices: "desktop",
          placeholder: "shortname",
          config: {
            size: "medium"
          }
        },
        {
          id: "logoSize",
          label: t("Avatar"),
          type: "slider",
          disabled: WPComments,
          config: {
            min: 10,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "starsSize",
          label: t("Rating"),
          type: "slider",
          disabled: WPComments || !review,
          config: {
            min: 5,
            max: 50,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
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
          type: "tabs",
          tabs: [
            {
              id: "tabTypographyName",
              label: t("Name"),
              options: [
                {
                  id: "name",
                  type: "typography",
                  disabled: WPComments,
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
                  type: "typography",
                  disabled: WPComments,
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
                  type: "typography",
                  disabled: WPComments,
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
                  type: "typography",
                  disabled: WPComments || review,
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
                  type: "typography",
                  disabled: WPComments,
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
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: borderColor
          }
        }
      },
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
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
                  disabled: WPComments,
                  type: "colorPicker",
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
                  disabled: WPComments,
                  type: "colorPicker",
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
                  type: "colorPicker",
                  disabled: WPComments,
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
                  type: "colorPicker",
                  disabled: WPComments,
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabReviewStarsColor",
              label: t("Stars"),
              options: [
                {
                  id: "starsColor",
                  type: "colorPicker",
                  disabled: WPComments || !review,
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabReviewStarsBgColor",
              label: t("Stars Bg"),
              options: [
                {
                  id: "starsBgColor",
                  type: "colorPicker",
                  disabled: WPComments || !review,
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
      type: "popover",
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
          type: "select",
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
          type: "inputText",
          placeholder: "http://",
          disabled: dvv("targetUrl") === "current",
          devices: "desktop",
          config: {
            size: "medium"
          }
        }
      ]
    }
  ];
}
