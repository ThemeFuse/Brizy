import { t } from "visual/utils/i18n";
import { IS_WP } from "visual/utils/env";

export default register => ({ getItems: getItems(register) });

const getShowLinkLabel = type => {
  switch (type) {
    case "forgot":
      return t("Back to Login");
    case "login":
    case "authorized":
    case "register":
      return t("Login");
  }
};

export const getItems = register => ({ v }) => {
  const typeChoices = [
    { value: "login", title: "Login" },
    { value: "authorized", title: "Authorized" },

    ...(register ? [{ value: "register", title: "Register" }] : []),
    ...(IS_WP ? [{ value: "forgot", title: "Forgot Password" }] : [])
  ];

  const { type } = v;

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
                  devices: "desktop",
                  choices: typeChoices
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
                  disabled: type !== "login",
                  type: "switch-dev"
                },
                {
                  id: "showRegisterInfo",
                  label: t("Register Info"),
                  devices: "desktop",
                  disabled: type !== "register",
                  type: "switch-dev"
                },
                {
                  id: "showLoginLink",
                  label: getShowLinkLabel(type),
                  devices: "desktop",
                  disabled: v.type === "login" || v.type === "authorized",
                  type: "switch-dev"
                },
                {
                  id: "showLostPassword",
                  label: t("Lost Password"),
                  devices: "desktop",
                  disabled: type === "forgot" || type === "authorized",
                  type: "switch-dev"
                },
                {
                  id: "showRegisterLink",
                  label: t("Register"),
                  devices: "desktop",
                  disabled: type === "register" || !register,
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
};
