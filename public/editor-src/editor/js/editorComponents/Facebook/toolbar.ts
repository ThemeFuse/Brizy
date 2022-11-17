import { ElementModel } from "visual/component/Elements/Types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { ToolbarItemType } from "../ToolbarItemType";

export interface Value extends ElementModel {
  facebookType: string;
  facebookEmbedType: string;

  borderColorHex: string;
  borderColorPalette: string;
  boxShadowColorHex: string;
  boxShadowColorPalette: string;
}

export function getItems({
  v,
  device,
  state,
  context
}: {
  v: ElementModel;
  device: ResponsiveMode;
  state: State;
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const facebookType = dvv("facebookType");
  const facebookEmbedType = dvv("facebookEmbedType");

  const embedType = facebookType === "embed";
  const buttonType = facebookType === "button";
  const pageType = facebookType === "page";
  const groupType = facebookType === "group";

  const postEmbedType = facebookEmbedType !== "post";
  const videoEmbedType = facebookEmbedType !== "video";

  const boxedLayout = dvv("layout") === "boxed";

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );
  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    dvv("boxShadowColorHex"),
    dvv("boxShadowColorPalette")
  );

  const linkDC = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.link
  );

  const labelTab = (facebookType: string) => {
    switch (facebookType) {
      case "button":
        return t("Button");
      case "embed":
        return t("Embed");
      case "page":
        return t("Page");
      case "group":
        return t("Group");
    }
  };

  const settings = (): ToolbarItemType[] => [
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      position: 110,
      options: [
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
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
          id: pageType ? "pageWidth" : "width",
          label: t("Width"),
          type: "slider-dev",
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
          type: "grid-dev",
          devices: "desktop",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              size: 1,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
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
                  type: "sidebarTabsButton-dev",
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
      // @ts-expect-error: Old option
      type: "advancedSettings",
      position: 110
    }
  ];

  const disabledToolbarSettings = (): ToolbarItemType[] => [
    { id: "toolbarSettings", type: "popover-dev", disabled: true }
  ];

  const disableAdvancedSettings = (): ToolbarItemType[] => [
    {
      id: "advancedSettings",
      // @ts-expect-error: Old option
      type: "advancedSettings",
      disabled: true
    }
  ];

  const disableAlign = (): ToolbarItemType[] => [
    { id: "horizontalAlign", type: "toggle-dev", disabled: true, choices: [] }
  ];

  const align = (): ToolbarItemType[] => [
    {
      id: "horizontalAlign",
      type: "toggle-dev",
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
      type: "toggle-dev",
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
              label: labelTab(facebookType),
              options: [
                {
                  id: "facebookType",
                  label: t("Facebook"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: t("Button"), value: "button" },
                    { title: t("Embed"), value: "embed" },
                    { title: t("Page"), value: "page" },
                    { title: t("Group"), value: "group" }
                  ]
                },
                {
                  id: "facebookButtonType",
                  type: "select-dev",
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
                  type: "select-dev",
                  devices: "desktop",
                  disabled: !buttonType,
                  choices: [
                    { title: t("Button"), value: "button" },
                    { title: t("Boxed"), value: "boxed" }
                  ]
                },
                {
                  id: "facebookEmbedType",
                  type: "select-dev",
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
                  type: "inputText-dev",
                  devices: "desktop",
                  disabled: !embedType || postEmbedType,
                  population: linkDC
                },
                {
                  id: "facebookEmbedVideoHref",
                  label: t("Link"),
                  type: "inputText-dev",
                  disabled: !embedType || videoEmbedType,
                  devices: "desktop",
                  population: linkDC
                },
                {
                  id: "facebookPageHref",
                  label: t("Link"),
                  type: "inputText-dev",
                  disabled: !pageType,
                  devices: "desktop",
                  population: linkDC
                },
                {
                  id: "pageTabs",
                  label: t("Layout"),
                  type: "multiSelect-dev",
                  placeholder: t("0 Selected"),
                  devices: "desktop",
                  disabled: !pageType,
                  choices: [
                    { title: t("Timeline"), value: "timeline" },
                    { title: t("Events"), value: "events" },
                    { title: t("Messages"), value: "messages" }
                  ]
                },
                {
                  id: "facebookGroupHref",
                  label: t("Link"),
                  type: "inputText-dev",
                  disabled: !groupType,
                  devices: "desktop",
                  population: linkDC
                },
                {
                  id: "skin",
                  label: t("Skin"),
                  type: "select-dev",
                  devices: "desktop",
                  disabled: !groupType,
                  choices: [
                    { title: t("Light"), value: "light" },
                    { title: t("Dark"), value: "dark" }
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
                  type: "radioGroup-dev",
                  choices: [
                    { icon: "nc-small", value: "small" },
                    { icon: "nc-large", value: "large" }
                  ]
                },
                {
                  id: "share",
                  disabled: !buttonType,
                  label: t("Include Share Button"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showCounter",
                  label: t("Show Button Counter"),
                  type: "switch-dev",
                  disabled: !buttonType || boxedLayout,
                  devices: "desktop"
                },
                {
                  id: "showFriends",
                  label: t("Show Friends' Faces"),
                  type: "switch-dev",
                  disabled: !buttonType || boxedLayout,
                  devices: "desktop"
                },
                {
                  id: "facebookEmbedVideoAllowFullScreen",
                  label: t("Full Screen"),
                  type: "switch-dev",
                  disabled: !embedType || videoEmbedType,
                  devices: "desktop"
                },
                {
                  id: "facebookEmbedVideoAutoPlay",
                  label: t("AutoPlay"),
                  type: "switch-dev",
                  disabled: !embedType || videoEmbedType,
                  devices: "desktop"
                },
                {
                  id: "facebookEmbedVideoCaptions",
                  label: t("Captions"),
                  type: "switch-dev",
                  disabled: !embedType || videoEmbedType,
                  devices: "desktop"
                },
                {
                  id: "postAndVideoShowText",
                  label: t("Include Full Post"),
                  disabled: !embedType,
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "smallHeader",
                  label: t("Use Small Header"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: !pageType
                },
                {
                  id: "hideCover",
                  label: t("Hide Cover Photo"),
                  type: "switch-dev",
                  disabled: !pageType,
                  devices: "desktop"
                },
                {
                  id: "showFacepile",
                  label: t("Show Friend's Faces"),
                  type: "switch-dev",
                  disabled: !pageType,
                  devices: "desktop"
                },
                {
                  id: "showSocialContext",
                  label: t("Show Social Context"),
                  type: "switch-dev",
                  disabled: !groupType,
                  devices: "desktop"
                },
                {
                  id: "showMetaData",
                  label: t("Show Meta Data"),
                  type: "switch-dev",
                  disabled: !groupType,
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
            backgroundColor: buttonType
              ? hexToRgba(boxShadowColorHex, dvv("boxShadowColorOpacity"))
              : hexToRgba(borderColorHex, dvv("borderColorOpacity"))
          }
        }
      },
      position: 80,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  disabled: buttonType,
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
          disabled: !buttonType,
          choices: [
            { title: t("Current Page"), value: "current" },
            { title: t("Custom Page"), value: "custom" }
          ]
        },
        {
          id: "href",
          type: "inputText-dev",
          label: t("Link"),
          disabled: !buttonType || dvv("targetUrl") === "current",
          devices: "desktop",
          placeholder: "http://",
          population: linkDC
        }
      ]
    },
    ...(groupType || pageType ? settings() : disabledToolbarSettings()),
    ...(groupType || pageType ? disableAdvancedSettings() : advancedSettings()),
    ...(embedType ? disableAlign() : pageType ? pageAlign() : align())
  ];
}
