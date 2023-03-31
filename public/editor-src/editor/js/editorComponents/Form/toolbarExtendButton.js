import _ from "underscore";
import { t } from "visual/utils/i18n";

export function getItems({ v }) {
  const fields = _.pluck(v.items[0].value.items, "value");

  return [
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
    },
    {
      id: "toolbarFormLink",
      type: "popover-dev",
      config: {
        icon: "nc-link",
        title: t("Link"),
        size: "medium"
      },
      position: 90,
      options: [
        {
          id: "formLink",
          type: "tabs-dev",
          tabs: [
            {
              id: "message",
              label: t("Message"),
              options: [
                {
                  id: "messageSuccess",
                  type: "inputText-dev",
                  label: t("Success"),
                  placeholder: t("Message sent"),
                  devices: "desktop"
                },
                {
                  id: "messageError",
                  type: "inputText-dev",
                  label: t("Error"),
                  placeholder: t("Message not sent"),
                  devices: "desktop"
                }
              ]
            },
            {
              id: "redirect",
              label: t("Redirect"),
              options: [
                {
                  id: "messageRedirect",
                  type: "inputText-dev",
                  label: t("Go to"),
                  placeholder: "http://",
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "apps",
      type: "formApps-dev",
      devices: "desktop",
      config: {
        id: v._id,
        fields,
        icon: "nc-extensions-2"
      }
    }
  ];
}
