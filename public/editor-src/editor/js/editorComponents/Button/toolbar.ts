import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getEnabledLinkOptions } from "visual/global/Config/types/configs/featuresValue";
import { isPopup, isStory } from "visual/providers/EditorModeProvider";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { popupToOldModel } from "visual/utils/options/PromptAddPopup/utils";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Props, Value } from "./types";
import { getMaxBorderRadius } from "./utils";

export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  component,
  editorMode
}) => {
  const _isStory = isStory(editorMode);
  const _isPopup = isPopup(editorMode);

  const inPopup = Boolean(component.props.meta?.sectionPopup);
  const inPopup2 = Boolean(component.props.meta?.sectionPopup2);

  const context = component.context;

  const dvv = (key: string) => defaultValueValue({ v, key, device });

  // Used getReduxStore() to retrieve the latest state
  const maxBorderRadius = getMaxBorderRadius({
    v,
    device,
    store: component.getReduxStore()
  });

  // Colors
  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );

  const color = getColorToolbar(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText,
    config: { iconOnly: true }
  });

  const linkDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
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

  const fillTypeDefault = fillType === "default";

  const {
    internalLink,
    linkPopup: linkPopupEnabled,
    linkAnchor,
    linkExternal
  } = getEnabledLinkOptions(component.getGlobalConfig());

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 20,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Button"),
              roles: ["admin"],
              options: [
                {
                  id: "sizeGroup",
                  type: "group",
                  position: 10,
                  disabled: _isStory,
                  options: [
                    {
                      id: "size",
                      label: t("Size"),
                      type: "radioGroup",
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
                      type: "slider",
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
                      type: "slider",
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
                  type: "radioGroup",
                  position: 20,
                  choices: [
                    { value: "filled", icon: "nc-circle" },
                    { value: "outline", icon: "nc-outline" },
                    { value: "default", icon: "nc-close" }
                  ]
                },
                {
                  id: "borderRadiusTypeGroup",
                  type: "group",
                  devices: "desktop",
                  disabled: searchType || fillTypeDefault,
                  position: 30,
                  options: [
                    {
                      id: "borderRadiusType",
                      label: t("Corner"),
                      type: "radioGroup",
                      choices: [
                        { value: "square", icon: "nc-corners-square" },
                        { value: "rounded", icon: "nc-corners-round" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "borderRadius",
                      type: "slider",
                      disabled: customBorderRadius,
                      config: {
                        min: 0,
                        max: _isStory ? 100 : maxBorderRadius,
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
                  type: "iconSetter",
                  devices: "desktop",
                  config: { canDelete: true }
                },
                {
                  id: "iconPosition",
                  label: t("Position"),
                  devices: "desktop",
                  type: "radioGroup",
                  disabled: disableIconOptions,
                  choices: [
                    { value: "left", icon: "nc-align-left" },
                    { value: "right", icon: "nc-align-right" }
                  ]
                },
                {
                  id: "iconSizeGroup",
                  type: "group",
                  devices: "desktop",
                  disabled: disableIconOptions,
                  options: [
                    {
                      id: "iconSize",
                      label: t("Size"),
                      type: "radioGroup",
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "iconCustomSize",
                      type: "slider",
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
                  type: "slider",
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
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "xlarge" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid",
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
                  type: "typography",
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
                  type: "population",
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
      type: "popover",
      devices: "desktop",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: fillType === "filled" ? bgColor : color
          }
        }
      },
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "tabsColor",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "",
                  type: "backgroundColor",
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
                  type: "colorPicker",
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
                  type: "border",
                  states: [NORMAL, HOVER],
                  disabled: fillTypeDefault
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
                  states: [NORMAL, HOVER],
                  disabled: fillTypeDefault
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
        size: "medium",
        title: t("Link")
      },
      devices: "desktop",
      disabled: submitType || searchType,
      position: 90,
      options: [
        {
          id: "linkType",
          type: "tabs",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "page",
              label: t("Page"),
              disabled: !internalLink,
              options: [
                {
                  id: "linkPage",
                  type: "internalLink",
                  label: t("Find Page")
                },
                {
                  id: "linkInternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch"
                }
              ]
            },
            {
              id: "external",
              label: t("URL"),
              disabled: !linkExternal,
              options: [
                {
                  id: "link",
                  type: "population",
                  label: t("Link to"),
                  config: linkDC,
                  option: {
                    id: "linkExternal",
                    type: "inputText",
                    placeholder: "http://"
                  }
                },
                {
                  id: "linkExternalBlank",
                  label: t("Open In New Tab"),
                  type: "switch"
                },
                {
                  id: "linkExternalRel",
                  label: t("Make it Nofollow"),
                  type: "switch"
                }
              ]
            },
            {
              id: "anchor",
              label: t("Block"),
              disabled: !linkAnchor,
              options: [
                {
                  id: "linkAnchor",
                  label: t("Block"),
                  type: "blockThumbnail",
                  disabled: _isPopup || _isStory
                }
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              disabled: !linkPopupEnabled,
              options: [
                {
                  id: "linkPopup",
                  disabled: inPopup || inPopup2 || _isPopup || _isStory,
                  type: "promptAddPopup",
                  label: t("Popup"),
                  config: {
                    popupKey: `${component.getId()}_${linkPopup}`,
                    canDelete: device === "desktop"
                  },
                  dependencies: popupToOldModel
                }
              ]
            },
            {
              id: "story",
              label: t("Slides"),
              options: [
                {
                  id: "linkToSlide",
                  type: "number",
                  label: t("Slide"),
                  disabled: !_isStory,
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
      devices: "desktop",
      title: t("Settings")
    }
  ];
};
