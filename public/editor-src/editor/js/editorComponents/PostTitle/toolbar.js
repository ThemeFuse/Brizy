import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getEnabledLinkOptions } from "visual/global/Config/types/configs/featuresValue";
import { isPopup } from "visual/providers/EditorModeProvider";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentChoices,
  getDynamicContentOption
} from "visual/utils/options";
import { popupToOldModel } from "visual/utils/options/PromptAddPopup/utils";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarLinkAnchor } from "visual/utils/toolbar";

export function getItems({ v, device, component, context, editorMode }) {
  const config = component.getGlobalConfig();

  const _isPopup = isPopup(editorMode);
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

  const inPopup = Boolean(component.props.meta.sectionPopup);
  const inPopup2 = Boolean(component.props.meta.sectionPopup2);

  const color = getColorToolbar(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );

  const linkPopup = dvv("linkPopup");

  const activeChoice = config.contentDefaults.PostTitle.textPopulation;

  const disablePredefinedPopulation =
    config.elements?.postTitle?.predefinedPopulation === false;
  const predefinedChoices = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.richText
  );

  const linkDC = getDynamicContentOption({
    options: component.context.dynamicContent.config,
    type: DCTypes.link
  });

  const {
    internalLink,
    linkPopup: linkPopupEnabled,
    linkAnchor,
    linkExternal
  } = getEnabledLinkOptions(config);

  return [
    {
      id: "popoverTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "xlarge" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid",
          config: { separator: true },
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
              size: "1",
              align: "center",
              options: [
                {
                  id: "text",
                  devices: "desktop",
                  disabled: disablePredefinedPopulation || !activeChoice,
                  type: "predefinedPopulation",
                  config: {
                    activeChoice,
                    choices: predefinedChoices
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
            saveTab: true,
            showSingle: true
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
                    type: "linkExternal",
                    placeholder: "http://",
                    config: {
                      size: "medium"
                    }
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
                toolbarLinkAnchor({
                  v,
                  device,
                  state: "normal",
                  disabled: _isPopup
                })
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
                  label: t("Popup"),
                  config: {
                    popupKey: `${component.getId()}_${linkPopup}`,
                    canDelete: device === "desktop"
                  },
                  disabled:
                    device === "desktop"
                      ? inPopup || inPopup2 || _isPopup
                      : dvv("linkType") !== "popup" || linkPopup === "",
                  dependencies: popupToOldModel
                }
              ]
            }
          ]
        }
      ]
    },
    { id: "horizontalAlign", type: "toggle", disabled: true },
    {
      id: "contentHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" },
        { icon: "nc-text-align-justify", title: t("Align"), value: "justify" }
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
}
