import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isPopup, isStory } from "visual/global/EditorModeContext";
import { getLeadificCustomFields } from "visual/utils/api";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { popupToOldModel } from "visual/utils/options/PromptAddPopup/utils";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import * as Str from "visual/utils/string/specs";
import { toolbarLinkAnchor } from "visual/utils/toolbar";
import { GetItems } from "../EditorComponent/types";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  context,
  component,
  state,
  editorMode
}) => {
  const config = component.getGlobalConfig();

  const _isStory = isStory(editorMode);
  const _isPopup = isPopup(editorMode);

  const inPopup = Boolean(component.props.meta?.sectionPopup);
  const inPopup2 = Boolean(component.props.meta?.sectionPopup2);

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const color = getColor(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );
  const linkPopup = Str.read(dvv("linkPopup"));

  const linkDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.link
  });

  return [
    {
      id: "toolbarLeadific",
      type: "popover",
      config: {
        icon: "nc-leadific",
        title: t("Leadific")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabSettings",
              label: t("Settings"),
              options: [
                {
                  id: "leadificCustomFields",
                  devices: "desktop",
                  label: t("Custom Fields"),
                  type: "select",
                  choices: {
                    load: () => getLeadificCustomFields(config),
                    emptyLoad: {
                      title: t("No custom fields found!")
                    }
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
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "typography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
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
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
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
              id: "tabTextStroke",
              label: t("Stroke"),
              options: [
                {
                  id: "textStrokeBorder",
                  type: "border",
                  config: {
                    width: ["grouped"],
                    styles: ["none", "solid"]
                  },
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabTextShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "textShadow",
                  type: "textShadow",
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
        size: "medium",
        title: t("Link")
      },
      devices: "desktop",
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
              id: "external",
              label: t("URL"),
              options: [
                {
                  id: "linkExternal",
                  type: "inputText",
                  label: t("Link to"),
                  placeholder: "https://",
                  devices: "desktop",
                  population: linkDC,
                  config: {
                    size: "medium"
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
              options: [
                toolbarLinkAnchor({
                  v,
                  device,
                  state,
                  disabled: _isPopup || _isStory
                })
              ]
            },
            {
              id: "popup",
              label: t("Popup"),
              options: [
                {
                  id: "linkPopup",
                  disabled: inPopup || inPopup2 || _isPopup || _isStory,
                  type: "promptAddPopup",
                  label: t("Popup"),
                  config: {
                    popupKey: `${component.getId()}_${linkPopup}`
                  },
                  dependencies: popupToOldModel
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
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      title: t("Settings"),
      roles: ["admin"],
      devices: "desktop"
    }
  ];
};
