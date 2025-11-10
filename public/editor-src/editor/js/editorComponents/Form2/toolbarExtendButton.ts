import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { isPopup, isStory } from "visual/providers/EditorModeProvider";
import { t } from "visual/utils/i18n";
import { toolbarElementForm2Apps } from "visual/utils/toolbar";
import type { Value } from "./types";
import { getEnabledLinkOptions } from "visual/global/Config/types/configs/featuresValue";

export const getItems: GetItems<Value> = ({
  v,
  device,
  editorMode,
  component
}) => {
  const _isStory = isStory(editorMode);
  const config = component.getGlobalConfig();

  const { showIntegrations = false } = config.integrations?.form ?? {};

  const { multistep } = v;

  const isMultistepEnabled = multistep === "on";

  const inPopup2 = Boolean(
    component.props.meta && component.props.meta.sectionPopup2
  );

  const { linkAction } = getEnabledLinkOptions(component.getGlobalConfig());

  const _isPopup = isPopup(editorMode);

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
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Button"),
              options: [
                {
                  id: "msButtonsSpacing",
                  type: "slider",
                  label: t("Spacing"),
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
      id: "popoverLink",
      type: "popover",
      config: {
        icon: "nc-link",
        title: t("Link"),
        size: "medium"
      },
      position: 90,
      options: [
        {
          id: "linkForm",
          type: "tabs",
          tabs: [
            {
              id: "message",
              label: t("Message"),
              options: [
                {
                  id: "messageSuccess",
                  label: t("Success"),
                  type: "inputText",
                  devices: "desktop",
                  placeholder: t("Message sent")
                },
                {
                  id: "messageError",
                  label: t("Error"),
                  type: "inputText",
                  devices: "desktop",
                  placeholder: t("Message not sent")
                },
                {
                  id: "messageEmptyRequired",
                  label: t("Fields Required"),
                  type: "inputText",
                  devices: "desktop",
                  placeholder: t("Fields are required")
                }
              ]
            },
            {
              id: "redirect",
              label: t("Redirect"),
              options: [
                {
                  id: "messageRedirect",
                  label: t("Go to"),
                  type: "inputText",
                  devices: "desktop",
                  placeholder: "http://"
                }
              ]
            },
            {
              id: "action",
              label: t("Action"),
              options: [
                {
                  id: "actionClosePopup",
                  label: t("Close Popup"),
                  type: "switch",
                  devices: "desktop",
                  disabled: !(inPopup2 || _isPopup) || !linkAction
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      disabled: isMultistepEnabled,
      options: [
        {
          id: "submitWidth",
          type: "slider",
          label: t("Width"),
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "submitHeight",
          label: t("Height"),
          type: "slider",
          disabled: !_isStory,
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "styles",
          type: "sidebarTabsButton",
          devices: "desktop",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    },
    {
      id: "advancedSettings2",
      type: "advancedSettings",
      position: 110,
      disabled: !isMultistepEnabled
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      position: 100,
      disabled: isMultistepEnabled,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "multiStepBtnHorizontalAlign",
      type: "toggle",
      position: 100,
      disabled: !isMultistepEnabled,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    toolbarElementForm2Apps({
      v,
      device,
      devices: "desktop",
      state: "normal",
      showIntegrations,
      tabs: config.integrations?.form?.tabs
    })
  ];
};
