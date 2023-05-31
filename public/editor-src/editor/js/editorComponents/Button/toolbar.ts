import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { Block } from "visual/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentOption,
  getOptionColorHexByPalette
} from "visual/utils/options";
import * as Num from "visual/utils/reader/number";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarLinkAnchor, toolbarLinkExternal } from "visual/utils/toolbar";
import { Props, Value } from "./types";
import { getMaxBorderRadius } from "./utils";

// @ts-expect-error "advancedSettings" old option
export const getItems: GetItems<Value, Props> = ({ v, device, component }) => {
  const config = Config.getAll();
  const IS_STORY = isStory(config);
  const IS_GLOBAL_POPUP = isPopup(config);

  const inPopup = Boolean(component.props.meta?.sectionPopup);
  const inPopup2 = Boolean(component.props.meta?.sectionPopup2);

  const context = component.context;

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const maxBorderRadius = getMaxBorderRadius(v, device);

  // Colors
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText,
    config: { iconOnly: true }
  });

  const type = dvv("type");
  const linkPopup = dvv("linkPopup");
  const fillType = dvv("fillType");

  const submitType = type === "submit";
  const searchType = type === "search";

  const customSize = dvv("size") !== "custom";
  const customIconSize = dvv("iconSize") !== "custom";
  const customBorderRadius = dvv("borderRadiusType") !== "custom";

  const disableIconOptions = dvv("iconName") === "" && dvv("iconType") === "";

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 20,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Button"),
              roles: ["admin"],
              options: [
                {
                  id: "sizeGroup",
                  type: "group-dev",
                  position: 10,
                  disabled: IS_STORY,
                  options: [
                    {
                      id: "size",
                      label: t("Size"),
                      type: "radioGroup-dev",
                      choices: [
                        { value: "small", icon: "nc-small" },
                        { value: "medium", icon: "nc-medium" },
                        { value: "large", icon: "nc-large" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "paddingRL",
                      label: t("Width"),
                      type: "slider-dev",
                      disabled: submitType || customSize,
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      }
                    },
                    {
                      id: "paddingTB",
                      label: t("Height"),
                      type: "slider-dev",
                      disabled: customSize,
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "fillType",
                  label: t("Fill"),
                  devices: "desktop",
                  type: "radioGroup-dev",
                  position: 20,
                  choices: [
                    { value: "filled", icon: "nc-circle" },
                    { value: "outline", icon: "nc-outline" },
                    { value: "default", icon: "nc-close" }
                  ]
                },
                {
                  id: "borderRadiusTypeGroup",
                  type: "group-dev",
                  devices: "desktop",
                  disabled: searchType,
                  position: 30,
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
                      disabled: customBorderRadius,
                      config: {
                        min: 0,
                        max: IS_STORY ? 100 : maxBorderRadius,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "currentShortcodeIconTab",
              label: t("Icon"),
              options: [
                {
                  id: "icon",
                  label: t("Icon"),
                  type: "iconSetter-dev",
                  devices: "desktop",
                  config: { canDelete: true }
                },
                {
                  id: "iconPosition",
                  label: t("Position"),
                  devices: "desktop",
                  type: "radioGroup-dev",
                  disabled: disableIconOptions,
                  choices: [
                    { value: "left", icon: "nc-align-left" },
                    { value: "right", icon: "nc-align-right" }
                  ]
                },
                {
                  id: "iconSizeGroup",
                  type: "group-dev",
                  devices: "desktop",
                  disabled: disableIconOptions,
                  options: [
                    {
                      id: "iconSize",
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
                      id: "iconCustomSize",
                      type: "slider-dev",
                      disabled: customIconSize,
                      config: {
                        min: 1,
                        max: 100,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider-dev",
                  devices: "desktop",
                  roles: ["admin"],
                  disabled: disableIconOptions,
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "xlarge" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid-dev",
          className: "brz-typography-grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
              size: 1,
              align: "center",
              options: [
                {
                  id: "",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "col-2",
              size: "auto",
              align: "center",
              className: "brz-typography-population",
              options: [
                {
                  id: "text",
                  type: "population-dev",
                  disabled: richTextDC === undefined,
                  config: richTextDC,
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
      devices: "desktop",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              Num.read(dvv("bgColorOpacity")) ?? 0 > 0
                ? hexToRgba(bgColorHex, dvv("bgColorOpacity"))
                : hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "tabsColor",
          className: "",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "",
                  type: "backgroundColor-dev",
                  states: [NORMAL, HOVER],
                  disabled: fillType !== "filled"
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
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
                  type: "border-dev",
                  states: [NORMAL, HOVER],
                  disabled: fillType === "default"
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
                  states: [NORMAL, HOVER],
                  disabled: fillType === "default"
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
      disabled: submitType || searchType,
      position: 90,
      options: [
        {
          id: "linkType",
          type: "tabs-dev",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "external",
              label: t("URL"),
              options: [
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
                  disabled: inPopup || inPopup2 || IS_GLOBAL_POPUP || IS_STORY,
                  type: "promptAddPopup",
                  label: t("Popup"),
                  popupKey: `${component.getId()}_${linkPopup}`,
                  value: {
                    value: linkPopup,
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
              options: [
                {
                  id: "linkToSlide",
                  type: "number-dev",
                  label: t("Slide"),
                  disabled: !IS_STORY,
                  config: {
                    min: 1,
                    max: 1000000
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: submitType || searchType,
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      devices: "desktop",
      title: t("Settings")
    }
  ];
};
