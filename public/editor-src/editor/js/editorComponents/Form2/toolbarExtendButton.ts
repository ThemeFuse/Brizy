import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { isStory } from "visual/providers/EditorModeProvider";
import { t } from "visual/utils/i18n";
import { toolbarElementForm2Apps } from "visual/utils/toolbar";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({
  v,
  device,
  editorMode,
  component
}) => {
  const _isStory = isStory(editorMode);
  const config = component.getGlobalConfig();

  const { showIntegrations = false } = config.integrations?.form ?? {};

  return [
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
      options: [
        {
          id: "submitWidth",
          label: t("Width"),
          type: "slider",
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
      id: "horizontalAlign",
      type: "toggle",
      position: 100,
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
