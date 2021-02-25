import { t } from "visual/utils/i18n";

export default register => ({ getItems: getItems(register) });

export const getItems = register => ({ v }) => {
  const typeChoices = register
    ? [
        { value: "login", title: "Login" },
        { value: "authorized", title: "Authorized" },
        { value: "register", title: "Register" },
        { value: "forgot", title: "Forgot Password" }
      ]
    : [
        { value: "login", title: "Login" },
        { value: "authorized", title: "Authorized" },
        { value: "forgot", title: "Forgot Password" }
      ];

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
                  disabled: v.type !== "login",
                  type: "switch-dev"
                },
                {
                  id: "showRegisterInfo",
                  label: t("Register Info"),
                  devices: "desktop",
                  disabled: v.type !== "register",
                  type: "switch-dev"
                },
                {
                  id: "showLostPassword",
                  label: t("Lost Password"),
                  devices: "desktop",
                  disabled: v.type === "forgot",
                  type: "switch-dev"
                },
                {
                  id: "showRegisterLink",
                  label: t("Register"),
                  devices: "desktop",
                  disabled: v.type === "register" || !register,
                  type: "switch-dev"
                },
                {
                  id: "showLoginLink",
                  label: t("Login"),
                  devices: "desktop",
                  disabled: v.type === "login",
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
