import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getEnabledLinkOptions } from "visual/global/Config/types/configs/featuresValue";
import { isPopup, isStory } from "visual/providers/EditorModeProvider";
import { getColorToolbar } from "visual/utils/color";
import { DESKTOP } from "visual/utils/devices";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { popupToOldModel } from "visual/utils/options/PromptAddPopup/utils";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarLinkAnchor } from "visual/utils/toolbar";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  component,
  context,
  editorMode
}) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const color = getColorToolbar(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );

  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  const _isStory = isStory(editorMode);
  const _isPopup = isPopup(editorMode);

  const linkDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
  });

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
        icon: "nc-star",
        title: t("Icon")
      },
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Icon"),
              options: [
                {
                  id: "",
                  label: t("Icon"),
                  type: "iconSetter",
                  devices: DESKTOP,
                  position: 40
                },
                {
                  id: "sizeGroup",
                  type: "group",
                  position: 60,
                  disabled: _isStory,
                  options: [
                    {
                      id: "size",
                      label: t("Size"),
                      type: "radioGroup",
                      choices: [
                        { value: "small", icon: "nc-32" },
                        { value: "medium", icon: "nc-48" },
                        { value: "large", icon: "nc-64" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "customSize",
                      type: "slider",
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
                  type: "slider",
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
                  type: "radioGroup",
                  devices: "desktop",
                  choices: [
                    { value: "filled", icon: "nc-circle" },
                    { value: "outline", icon: "nc-outline" },
                    { value: "default", icon: "nc-close" }
                  ]
                },
                {
                  id: "borderRadiusTypeGroup",
                  type: "group",
                  disabled:
                    dvv("fillType") === "default" ||
                    (dvv("borderStyle") === "none" &&
                      dvv("boxShadow") === "none"),
                  devices: "desktop",
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
                  type: "slider",
                  config: {
                    min: 0,
                    max: _isStory ? 50 : 180,
                    units: _isStory
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
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: color
          }
        }
      },
      roles: ["admin"],
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Icon"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
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
                  type: "backgroundColor",
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
                  type: "border",
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
                  type: "boxShadow",
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
      type: "popover",
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
          type: "tabs",
          config: { saveTab: true },
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
                //@ts-expect-error Option doesn't work
                toolbarLinkAnchor({ v, disabled: _isPopup || _isStory })
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              disabled: !linkPopupEnabled,
              options: [
                {
                  id: "linkPopup",
                  type: "promptAddPopup",
                  disabled: inPopup || inPopup2 || _isPopup || _isStory,
                  label: t("Popup"),
                  config: {
                    popupKey: `${component.getId()}_${dvv("linkPopup")}`
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
      devices: "desktop",
      type: "advancedSettings",
      roles: ["admin"],
      position: 110,
      title: t("Settings")
    }
  ];
};
