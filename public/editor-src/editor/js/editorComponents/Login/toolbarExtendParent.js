import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { IS_WP, IS_CLOUD } from "visual/utils/env";
import { getMembershipChoices } from "visual/utils/membership";

export default canRegister => ({ getItems: getItems(canRegister) });

const getShowLinkLabel = type => {
  switch (type) {
    case "forgot":
    case "register":
      return t("Back to Login");
    case "login":
    case "authorized":
      return t("Login");
  }
};

export const getItems = canRegister => ({ v }) => {
  const config = Config.getAll();

  const typeChoices = [
    { value: "login", title: "Login" },
    { value: "authorized", title: "Authorized" },
    ...(canRegister ? [{ value: "register", title: "Register" }] : []),
    { value: "forgot", title: "Forgot Password" }
  ];

  const { type } = v;

  const isRegister = type === "register";
  const isLogin = type === "login";
  const isForgot = type === "forgot";
  const isAuthorized = type === "authorized";

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
          config: { showSingle: true },
          tabs: [
            {
              id: "tabsCurrentElementField",
              label: t("Type"),
              options: [
                {
                  id: "type",
                  type: "select-dev",
                  label: t("Type"),
                  devices: "desktop",
                  choices: typeChoices
                },
                {
                  id: "defaultRoles",
                  type: "multiSelect-dev",
                  label: t("Default Roles"),
                  devices: "desktop",
                  placeholder: "none",
                  disabled: !isRegister || IS_WP,
                  choices: getMembershipChoices(config)
                }
              ]
            },
            {
              id: "tabsCurrentElementAdvanced",
              label: t("Advanced"),
              options: [
                {
                  id: "remember",
                  label: t("Remember me"),
                  devices: "desktop",
                  disabled: !isLogin,
                  type: "switch-dev"
                },
                {
                  id: "showName",
                  type: "switch-dev",
                  label: t("Full name"),
                  devices: "desktop",
                  disabled: !isAuthorized
                },
                {
                  id: "showFirstName",
                  label: t("First Name"),
                  devices: "desktop",
                  disabled: !isRegister || IS_WP,
                  type: "switch-dev"
                },
                {
                  id: "showLastName",
                  label: t("Last Name"),
                  devices: "desktop",
                  disabled: !isRegister || IS_WP,
                  type: "switch-dev"
                },
                {
                  id: "showUsername",
                  label: t("Username"),
                  devices: "desktop",
                  disabled: !isRegister || IS_WP,
                  type: "switch-dev"
                },
                {
                  id: "showPhoneNumber",
                  label: t("Phone Number"),
                  devices: "desktop",
                  disabled: !isRegister || IS_WP,
                  type: "switch-dev"
                },
                {
                  id: "showRegisterInfo",
                  label: t("Register Info"),
                  devices: "desktop",
                  disabled: !isRegister || IS_CLOUD,
                  type: "switch-dev"
                },
                {
                  id: "showLoginLink",
                  label: getShowLinkLabel(type),
                  devices: "desktop",
                  disabled: !isRegister && !isForgot,
                  type: "switch-dev"
                },
                {
                  id: "showLostPassword",
                  label: t("Lost Password"),
                  devices: "desktop",
                  disabled: !isRegister && !isLogin,
                  type: "switch-dev"
                },
                {
                  id: "showRegisterLink",
                  label: t("Register"),
                  devices: "desktop",
                  disabled: (!isForgot && !isLogin) || !canRegister,
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
