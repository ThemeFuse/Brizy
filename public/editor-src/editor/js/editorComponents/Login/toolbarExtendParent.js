import { t } from "visual/utils/i18n";

export function getItems({ v }) {
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-form-left",
        title: t("Forms")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElementFields",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabsCurrentElementField",
              label: t("Type"),
              options: [
                {
                  id: "type",
                  type: "select-dev",
                  label: "Type",
                  choices: [
                    { value: "login", title: "Login" },
                    { value: "authorized", title: "Authorized" }
                    // { value: "register", title: "Register" },
                    // { value: "forgot", title: "Forgot Password" }
                  ]
                }
              ]
            },
            {
              id: "tabsCurrentElementAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "remember",
                  label: t("Remember"),
                  devices: "desktop",
                  disabled: v.type !== "login",
                  type: "switch-dev"
                },
                {
                  id: "showLostPassword",
                  label: t("Lost Password"),
                  devices: "desktop",
                  disabled: v.type !== "login",
                  type: "switch-dev"
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
      disabled: true
    }
  ];
}
