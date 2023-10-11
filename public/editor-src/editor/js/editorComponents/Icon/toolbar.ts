import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config from "visual/global/Config";
import { Block } from "visual/types";
import { getCollectionTypes } from "visual/utils/api";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  toolbarLinkAnchor,
  toolbarLinkExternal,
  toolbarStoryAnchor
} from "visual/utils/toolbar";
import EditorComponent from "../EditorComponent";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { Value } from "./index";
import {DESKTOP} from "visual/utils/devices";

export function getItems({
  v,
  device,
  component,
  context
}: {
  v: Value;
  device: ResponsiveMode;
  component: EditorComponent<Value>;
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  const config = Config.getAll();
  const collectionTypesHandler =
    config?.api?.collectionTypes?.loadCollectionTypes.handler;

  const IS_STORY = isStory(config);
  const IS_GLOBAL_POPUP = isPopup(config);

  const linkSource = dvv("linkSource");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Icon"),
              options: [
                {
                  id: "",
                  label: t("Icon"),
                  type: "iconSetter-dev",
                  devices: DESKTOP,
                  position: 40
                },
                {
                  id: "sizeGroup",
                  type: "group-dev",
                  position: 60,
                  disabled: IS_STORY,
                  options: [
                    {
                      id: "size",
                      label: t("Size"),
                      type: "radioGroup-dev",
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "customSize",
                      type: "slider-dev",
                      disabled: dvv("size") !== "custom",
                      config: {
                        min: 14,
                        max: 180,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "padding",
                  label: t("Bg Size"),
                  type: "slider-dev",
                  devices: "responsive",
                  config: {
                    min: 0,
                    max: 180,
                    units: [{ title: "px", value: "px" }]
                  },
                  disabled: dvv("fillType") === "default"
                }
              ]
            },
            {
              id: "iconBackground",
              label: t("Background"),
              options: [
                {
                  id: "fillType",
                  label: t("Fill"),
                  type: "radioGroup-dev",
                  devices: "desktop",
                  choices: [
                    { value: "filled", icon: "nc-circle" },
                    { value: "outline", icon: "nc-outline" },
                    { value: "default", icon: "nc-close" }
                  ]
                },
                {
                  id: "borderRadiusTypeGroup",
                  type: "group-dev",
                  disabled:
                    dvv("fillType") === "default" ||
                    (dvv("borderStyle") === "none" &&
                      dvv("boxShadow") === "none"),
                  devices: "desktop",
                  options: [
                    {
                      id: "borderRadiusType",
                      label: t("Corner"),
                      type: "radioGroup-dev",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "borderRadius",
                      type: "slider-dev",
                      devices: "desktop",
                      disabled: dvv("borderRadiusType") !== "custom",
                      config: {
                        min: 0,
                        max: 500,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "padding",
                  label: t("Size"),
                  devices: "desktop",
                  disabled: dvv("fillType") === "default",
                  type: "slider-dev",
                  config: {
                    min: 0,
                    max: IS_STORY ? 50 : 180,
                    units: IS_STORY
                      ? [{ title: "%", value: "%" }]
                      : [{ title: "px", value: "px" }]
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
            backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Icon"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "",
                  type: "backgroundColor-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER],
                  disabled: dvv("fillType") !== "filled"
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  devices: "desktop",
                  type: "border-dev",
                  states: [NORMAL, HOVER],
                  disabled: dvv("fillType") === "default"
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  devices: "desktop",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER],
                  disabled: dvv("fillType") === "default"
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
        size: "medium",
        title: t("Link")
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "linkType",
          type: "tabs-dev",
          config: { saveTab: true },
          tabs: [
            {
              id: "page",
              label: t("Page"),
              options: [
                {
                  id: "linkSource",
                  type: "select-dev",
                  disabled: !collectionTypesHandler,
                  label: t("Type"),
                  devices: "desktop",
                  choices: {
                    load: () => getCollectionTypes(config),
                    emptyLoad: {
                      title: t("There are no choices")
                    }
                  },
                  config: {
                    size: "large"
                  }
                },
                {
                  id: "linkPage",
                  type: "internalLink-dev",
                  label: t("Find Page"),
                  devices: "desktop",
                  disabled: !linkSource,
                  config: {
                    postType: linkSource
                  }
                }
              ]
            },
            {
              id: "external",
              label: t("URL"),
              options: [
                //@ts-expect-error New option doesn't work
                toolbarLinkExternal({
                  v,
                  config: context.dynamicContent.config
                }),
                {
                  id: "linkExternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch-dev"
                },
                {
                  id: "linkExternalRel",
                  label: t("Make it Nofollow"),
                  type: "switch-dev"
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              options: [
                //@ts-expect-error Option doesn't work
                toolbarLinkAnchor({ v, disabled: IS_GLOBAL_POPUP || IS_STORY })
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                {
                  id: "linkPopup",
                  //@ts-expect-error New option doesn't work
                  type: "promptAddPopup",
                  disabled: inPopup || inPopup2 || IS_GLOBAL_POPUP || IS_STORY,
                  label: t("Popup"),
                  popupKey: `${component.getId()}_${dvv("linkPopup")}`,
                  value: {
                    value: dvv("linkPopup"),
                    popups: dvv("popups")
                  },
                  onChange: ({
                    value,
                    popups
                  }: {
                    value: string;
                    popups: Block[];
                  }) => ({
                    linkPopup: value,
                    popups
                  })
                }
              ]
            },
            {
              id: "story",
              label: t("Slides"),
              //@ts-expect-error Old option doesn't work
              options: [toolbarStoryAnchor({ disabled: !IS_STORY })]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      devices: "desktop",
      //@ts-expect-error Old option doesn't work
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
