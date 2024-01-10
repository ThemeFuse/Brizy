import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { toolbarElementForm2Apps } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const IS_STORY = isStory(Config.getAll());

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
                  placeholder: t("Message sent"),
                  config: {
                    size: "large"
                  }
                },
                {
                  id: "messageError",
                  label: t("Error"),
                  type: "inputText",
                  devices: "desktop",
                  placeholder: t("Message not sent"),
                  config: {
                    size: "large"
                  }
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
                  placeholder: "http://",
                  config: {
                    size: "large"
                  }
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
          disabled: !IS_STORY,
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
    toolbarElementForm2Apps({ v, device, devices: "desktop", state: "normal" })
  ];
}
