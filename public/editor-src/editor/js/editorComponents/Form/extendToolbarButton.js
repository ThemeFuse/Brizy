import { t } from "visual/utils/i18n";
import _ from "underscore";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

import {
  toolbarDisabledShowOnTablet,
  toolbarDisabledShowOnMobile,
  toolbarDisabledAdvancedSettings
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";
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
                  value: {
                    value: v.messageSuccess
                  },
                  onChange: ({ value: messageSuccess }) => ({
                    messageSuccess
                  })
                },
                {
                  id: "messageError",
                  type: "input",
                  label: t("Error"),
                  placeholder: t("Message not sent"),
                  value: {
                    value: v.messageError
                  },
                  onChange: ({ value: messageError }) => ({
                    messageError
                  })
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
                  value: {
                    value: v.messageRedirect
                  },
                  onChange: ({ value: messageRedirect }) => ({
                    messageRedirect
                  })
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
      id: "apps",
      type: "formApps",
      icon: "nc-extensions-2",
      value: {
        id: v._id,
        fields
      }
    },
    toolbarDisabledAdvancedSettings({ device })
  ];
}

export function getItemsForTablet(v) {
  return [
    toolbarDisabledShowOnTablet({}),
    {
      id: "tabletHorizontalAlign",
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
      value: tabletSyncOnChange(v, "horizontalAlign")
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    toolbarDisabledShowOnMobile({}),
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
      value: mobileSyncOnChange(v, "horizontalAlign")
    }
  ];
}
