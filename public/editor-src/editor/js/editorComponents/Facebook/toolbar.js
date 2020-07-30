import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarDisabledAdvancedSettings,
  toolbarDisabledToolbarSettings
} from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvkn = key => defaultValueKey({ key, device });

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device, state }),
    defaultValueValue({ v, key: "borderColorPalette", device, state })
  );
  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device, state }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device, state })
  );
  const linkDC = getDynamicContentChoices("link", true);
  const labelTab = {
    button: t("Button"),
    embed: t("Embed"),
    page: t("Page"),
    group: t("Group")
  };

  return [
    {
      id: "popoverCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-facebook",
        title: t("Facebook")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: labelTab[v.facebookType],
              options: [
                {
                  id: "facebookType",
                  label: t("Facebook"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("Button"),
                      value: "button"
                    },
                    {
                      title: t("Embed"),
                      value: "embed"
                    },
                    {
                      title: t("Page"),
                      value: "page"
                    },
                    {
                      title: t("Group"),
                      value: "group"
                    }
                  ]
                },
                {
                  id: "facebookButtonType",
                  type: "select-dev",
                  label: t("Type"),
                  disabled: v.facebookType !== "button",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("Like"),
                      value: "like"
                    },
                    {
                      title: t("Recommend"),
                      value: "recommend"
                    }
                  ]
                },
                {
                  id: "layout",
                  label: t("Layout"),
                  type: "select-dev",
                  devices: "desktop",
                  disabled: v.facebookType !== "button",
                  choices: [
                    {
                      title: t("Button"),
                      value: "button"
                    },
                    {
                      title: t("Boxed"),
                      value: "boxed"
                    }
                  ]
                },
                {
                  id: "facebookEmbedType",
                  type: "select-dev",
                  label: t("Type"),
                  disabled: v.facebookType !== "embed",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("Post"),
                      value: "post"
                    },
                    {
                      title: t("Video"),
                      value: "video"
                    }
                  ]
                },
                {
                  id: "facebookEmbedPostHref",
                  label: t("Link"),
                  type: "inputText-dev",
                  devices: "desktop",
                  disabled:
                    v.facebookType !== "embed" ||
                    v.facebookEmbedType !== "post",
                  population: linkDC
                },
                {
                  id: "facebookEmbedVideoHref",
                  label: t("Link"),
                  type: "inputText-dev",
                  disabled:
                    v.facebookType !== "embed" ||
                    v.facebookEmbedType !== "video",
                  devices: "desktop",
                  population: linkDC
                },
                {
                  id: "facebookPageHref",
                  label: t("Link"),
                  type: "inputText-dev",
                  disabled: v.facebookType !== "page",
                  devices: "desktop",
                  population: linkDC
                },
                {
                  id: "pageTabs",
                  label: t("Tab"),
                  type: "select-dev",
                  devices: "desktop",
                  disabled: v.facebookType !== "page",
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
                  ]
                },
                {
                  id: "facebookGroupHref",
                  label: t("Link"),
                  type: "inputText-dev",
                  disabled: v.facebookType !== "group",
                  devices: "desktop",
                  population: linkDC
                },
                {
                  id: "skin",
                  label: t("Skin"),
                  type: "select-dev",
                  devices: "desktop",
                  disabled: v.facebookType !== "group",
                  choices: [
                    {
                      title: t("Light"),
                      value: "light"
                    },
                    {
                      title: t("Dark"),
                      value: "dark"
                    }
                  ]
                }
              ]
            },
            {
              id: "tabAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "size",
                  label: t("Size"),
                  disabled: v.facebookType !== "button",
                  devices: "desktop",
                  type: "radioGroup-dev",
                  choices: [
                    { icon: "nc-small", value: "small" },
                    { icon: "nc-large", value: "large" }
                  ]
                },
                {
                  id: "share",
                  disabled: v.facebookType !== "button",
                  label: t("Include Share Button"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showCounter",
                  label: t("Show Button Counter"),
                  type: "switch-dev",
                  disabled: v.facebookType !== "button" || v.layout === "boxed",
                  devices: "desktop"
                },
                {
                  id: "showFriends",
                  label: t("Show Friends' Faces"),
                  type: "switch-dev",
                  disabled: v.facebookType !== "button" || v.layout === "boxed",
                  devices: "desktop"
                },
                {
                  id: "facebookEmbedVideoAllowFullScreen",
                  label: t("Full Screen"),
                  type: "switch-dev",
                  disabled:
                    v.facebookType !== "embed" ||
                    v.facebookEmbedType !== "video",
                  devices: "desktop"
                },
                {
                  id: "facebookEmbedVideoAutoPlay",
                  label: t("AutoPlay"),
                  type: "switch-dev",
                  disabled:
                    v.facebookType !== "embed" ||
                    v.facebookEmbedType !== "video",
                  devices: "desktop"
                },
                {
                  id: "facebookEmbedVideoCaptions",
                  label: t("Captions"),
                  type: "switch-dev",
                  disabled:
                    v.facebookType !== "embed" ||
                    v.facebookEmbedType !== "video",
                  devices: "desktop"
                },
                {
                  id: "postAndVideoShowText",
                  label: t("Include Full Post"),
                  disabled: v.facebookType !== "embed",
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "smallHeader",
                  label: t("Use Small Header"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: v.facebookType !== "page"
                },
                {
                  id: "hideCover",
                  label: t("Hide Cover Photo"),
                  type: "switch-dev",
                  disabled: v.facebookType !== "page",
                  devices: "desktop"
                },
                {
                  id: "showFacepile",
                  label: t("Show Friend's Faces"),
                  type: "switch-dev",
                  disabled: v.facebookType !== "page",
                  devices: "desktop"
                },
                {
                  id: "showSocialContext",
                  label: t("Show Social Context"),
                  type: "switch-dev",
                  disabled: v.facebookType !== "group",
                  devices: "desktop"
                },
                {
                  id: "showMetaData",
                  label: t("Show Meta Data"),
                  type: "switch-dev",
                  disabled: v.facebookType !== "group",
                  devices: "desktop"
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
            backgroundColor:
              v.facebookType === "button"
                ? hexToRgba(boxShadowColorHex, v.boxShadowColorOpacity)
                : hexToRgba(borderColorHex, v.borderColorOpacity)
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          hideHandlesWhenOne: false,
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  disabled: v.facebookType === "button",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
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
          disabled: v.facebookType !== "button",
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
          type: "inputText-dev",
          label: t("Link"),
          disabled: v.facebookType !== "button" || v.targetUrl === "current",
          devices: "desktop",
          placeholder: "http://",
          population: linkDC
        }
      ]
    },
    v.facebookType === "group" || v.facebookType === "page"
      ? {
          id: "toolbarSettings",
          type: "popover-dev",
          config: {
            icon: "nc-cog",
            title: t("Settings")
          },
          position: 110,
          options: [
            {
              id: "height",
              label: t("Height"),
              type: "slider-dev",
              disabled: v.facebookType !== "page",
              devices: "desktop",
              config: {
                min: 70,
                max: 800,
                units: [{ value: "px", title: "px" }],
                debounceUpdate: true
              }
            },
            {
              id: "width",
              label: t("Width"),
              type: "slider-dev",
              disabled: v.facebookType !== "group",
              devices: "desktop",
              config: {
                min: 180,
                max: 500,
                units: [{ value: "px", title: "px" }],
                debounceUpdate: true
              }
            },
            {
              id: dvk("advancedSettings"),
              type: "advancedSettings",
              label: t("More Settings"),
              icon: "nc-cog"
            }
          ]
        }
      : toolbarDisabledToolbarSettings({ device, state: "normal" }),
    v.facebookType !== "group" && v.facebookType !== "page"
      ? {
          id: dvkn("advancedSettings"),
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          roles: ["admin"],
          position: 110,
          icon: "nc-cog"
        }
      : toolbarDisabledAdvancedSettings({ device }),
    v.facebookType === "page" || v.facebookType === "embed"
      ? {
          id: "horizontalAlign",
          type: "toggle-dev",
          disabled: true
        }
      : {}
  ];
}
