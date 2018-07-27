import { t } from "visual/utils/i18n";
import _ from "underscore";

export function getItemsForDesktop(v) {
  const fields = _.pluck(v.items[0].value.items, "value");

  return [
    {
      id: "toolbarFormLink",
      type: "popover",
      icon: "nc-link",
      title: t("Link"),
      size: "medium",
      position: 90,
      options: [
        {
          id: "formLink",
          type: "tabs",
          tabs: [
            {
              id: "message",
              label: t("Message"),
              options: [
                {
                  id: "messageSuccess",
                  type: "input",
                  label: t("Success"),
                  placeholder: t("Message sent"),
                  value: v.messageSuccess
                },
                {
                  id: "messageError",
                  type: "input",
                  label: t("Error"),
                  placeholder: t("Message not sent"),
                  value: v.messageError
                }
              ]
            },
            {
              id: "redirect",
              label: t("Redirect"),
              options: [
                {
                  id: "messageRedirect",
                  type: "input",
                  label: t("Go to"),
                  placeholder: "http://",
                  value: v.messageRedirect
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
      ],
      value: v.horizontalAlign
    },
    {
      id: "toolbarSettings",
      type: "popover",
      disabled: true
    },
    {
      id: "apps",
      type: "formApps",
      icon: "nc-extensions-2",
      disabled: TARGET !== "WP",
      value: {
        id: v._id,
        fields
      }
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "showOnMobile",
      type: "toggle",
      disabled: true
    },
    {
      id: "mobileHorizontalAlign",
      type: "toggle",
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
      ],
      value: v.mobileHorizontalAlign
    },
    {
      id: "mobileToolbarSettings",
      type: "popover",
      disabled: true
    }
  ];
}
