import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { ToolbarItemType } from "../ToolbarItemType";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state, context }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const facebookType = dvv("facebookType");
  const facebookEmbedType = dvv("facebookEmbedType");

  const embedType = facebookType === "embed";
  const buttonType = facebookType === "button";
  const pageType = facebookType === "page";

  const postEmbedType = facebookEmbedType !== "post";
  const videoEmbedType = facebookEmbedType !== "video";

  const boxedLayout = dvv("layout") === "boxed";

  const borderColor = getColorToolbar(
    dvv("borderColorPalette"),
    dvv("borderColorHex"),
    dvv("borderColorOpacity")
  );

  const boxShadowColor = getColorToolbar(
    dvv("boxShadowColorPalette"),
    dvv("boxShadowColorHex"),
    dvv("boxShadowColorOpacity")
  );

  const linkDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
  });

  const labelTab = (facebookType: string) => {
    switch (facebookType) {
      case "button":
        return t("Button");
      case "embed":
        return t("Embed");
      case "page":
        return t("Page");
    }
  };

  const settings = (): ToolbarItemType[] => [
    {
      id: "toolbarSettings",
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      position: 110,
      options: [
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          disabled: !pageType,
          devices: "desktop",
          config: {
            min: 70,
            max: 800,
            units: [{ value: "px", title: "px" }],
            debounceUpdate: true
          }
        },
        {
          id: "pageWidth",
          label: t("Width"),
          type: "slider",
          disabled: embedType || buttonType,
          devices: "desktop",
          config: {
            min: 180,
            max: 500,
            units: [{ value: "px", title: "px" }],
            debounceUpdate: true
          }
        },
        {
          id: "grid",
          type: "grid",
          devices: "desktop",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              size: 1,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "col-2",
              size: 1,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const advancedSettings = (): ToolbarItemType[] => [
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110
    }
  ];

  const disabledToolbarSettings = (): ToolbarItemType[] => [
    { id: "toolbarSettings", type: "popover", disabled: true }
  ];

  const disableAdvancedSettings = (): ToolbarItemType[] => [
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
    }
  ];

  const disableAlign = (): ToolbarItemType[] => [
    { id: "horizontalAlign", type: "toggle", disabled: true, choices: [] }
  ];

  const align = (): ToolbarItemType[] => [
    {
      id: "horizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    }
  ];

  const pageAlign = (): ToolbarItemType[] => [
    {
      id: "pageHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    ...disableAlign()
  ];

  return [
    {
      id: "popoverCurrentElement",
      type: "popover",
      config: {
        icon: "nc-facebook",
        title: t("Facebook")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: labelTab(facebookType),
              options: [
                {
                  id: "facebookType",
                  label: t("Facebook"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    { title: t("Button"), value: "button" },
                    { title: t("Embed"), value: "embed" },
                    { title: t("Page"), value: "page" }
                  ]
                },
                {
                  id: "facebookButtonType",
                  type: "select",
                  label: t("Type"),
                  disabled: !buttonType,
                  devices: "desktop",
                  choices: [
                    { title: t("Like"), value: "like" },
                    { title: t("Recommend"), value: "recommend" }
                  ]
                },
                {
                  id: "layout",
                  label: t("Layout"),
                  type: "select",
                  devices: "desktop",
                  disabled: !buttonType,
                  choices: [
                    { title: t("Button"), value: "button" },
                    { title: t("Boxed"), value: "boxed" }
                  ]
                },
                {
                  id: "facebookEmbedType",
                  type: "select",
                  label: t("Type"),
                  disabled: !embedType,
                  devices: "desktop",
                  choices: [
                    { title: t("Post"), value: "post" },
                    { title: t("Video"), value: "video" }
                  ]
                },
                {
                  id: "facebookEmbedPostHref",
                  label: t("Link"),
                  type: "inputText",
                  devices: "desktop",
                  disabled: !embedType || postEmbedType,
                  population: linkDC
                },
                {
                  id: "facebookEmbedVideoHref",
                  label: t("Link"),
                  type: "inputText",
                  disabled: !embedType || videoEmbedType,
                  devices: "desktop",
                  population: linkDC
                },
                {
                  id: "facebookPageHref",
                  label: t("Link"),
                  type: "inputText",
                  disabled: !pageType,
                  devices: "desktop",
                  population: linkDC
                },
                {
                  id: "pageTabs",
                  label: t("Layout"),
                  type: "multiSelect",
                  placeholder: t("0 Selected"),
                  devices: "desktop",
                  disabled: !pageType,
                  choices: [
                    { title: t("Timeline"), value: "timeline" },
                    { title: t("Events"), value: "events" },
                    { title: t("Messages"), value: "messages" }
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
                  disabled: !buttonType,
                  devices: "desktop",
                  type: "radioGroup",
                  choices: [
                    { icon: "nc-small", value: "small" },
                    { icon: "nc-large", value: "large" }
                  ]
                },
                {
                  id: "share",
                  disabled: !buttonType,
                  label: t("Include Share Button"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showCounter",
                  label: t("Show Button Counter"),
                  type: "switch",
                  disabled: !buttonType || boxedLayout,
                  devices: "desktop"
                },
                {
                  id: "showFriends",
                  label: t("Show Friend's Faces"),
                  type: "switch",
                  disabled: !buttonType || boxedLayout,
                  devices: "desktop"
                },
                {
                  id: "facebookEmbedVideoAllowFullScreen",
                  label: t("Full Screen"),
                  type: "switch",
                  disabled: !embedType || videoEmbedType,
                  devices: "desktop"
                },
                {
                  id: "facebookEmbedVideoAutoPlay",
                  label: t("AutoPlay"),
                  type: "switch",
                  disabled: !embedType || videoEmbedType,
                  devices: "desktop"
                },
                {
                  id: "facebookEmbedVideoCaptions",
                  label: t("Captions"),
                  type: "switch",
                  disabled: !embedType || videoEmbedType,
                  devices: "desktop"
                },
                {
                  id: "postAndVideoShowText",
                  label: t("Include Full Post"),
                  disabled: !embedType,
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "smallHeader",
                  label: t("Use Small Header"),
                  type: "switch",
                  devices: "desktop",
                  disabled: !pageType
                },
                {
                  id: "hideCover",
                  label: t("Hide Cover Photo"),
                  type: "switch",
                  disabled: !pageType,
                  devices: "desktop"
                },
                {
                  id: "showFacepile",
                  label: t("Show Friend's Faces"),
                  type: "switch",
                  disabled: !pageType,
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
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: buttonType ? boxShadowColor : borderColor
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBackground",
              label: t("Bg"),
              options: [
                {
                  id: "",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  disabled: buttonType,
                  type: "border",
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
                  type: "boxShadow",
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
          disabled: !buttonType,
          choices: [
            { title: t("Current Page"), value: "current" },
            { title: t("Custom Page"), value: "custom" }
          ]
        },
        {
          id: "href",
          type: "inputText",
          label: t("Link"),
          disabled: !buttonType || dvv("targetUrl") === "current",
          devices: "desktop",
          placeholder: "http://",
          population: linkDC
        }
      ]
    },
    ...(pageType ? settings() : disabledToolbarSettings()),
    ...(pageType ? disableAdvancedSettings() : advancedSettings()),
    ...(embedType ? disableAlign() : pageType ? pageAlign() : align())
  ];
};
