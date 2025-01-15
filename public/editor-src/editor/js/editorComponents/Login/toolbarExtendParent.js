import { isWp } from "visual/global/Config";
import { isCloud } from "visual/global/Config/types";
import { t } from "visual/utils/i18n";
import { getMembershipChoices } from "visual/utils/membership";
import { defaultValueValue } from "visual/utils/onChange";

export default (canRegister) => ({ getItems: getItems(canRegister) });

const getShowLinkLabel = (type) => {
  switch (type) {
    case "forgot":
    case "register":
      return t("Back to Login");
    case "login":
    case "authorized":
      return t("Login");
  }
};

export const getItems =
  (canRegister) =>
  ({ v, device, component }) => {
    const config = component.getGlobalConfig();
    const is_wp = isWp(config);
    const is_cloud = isCloud(config);
    const dvv = (key) => defaultValueValue({ v, key, device });

    const typeChoices = [
      { value: "login", title: t("Login") },
      { value: "authorized", title: t("Authorized") },
      ...(canRegister ? [{ value: "register", title: t("Register") }] : []),
      { value: "forgot", title: t("Forgot Password") }
    ];

    const type = dvv("type");

    const isRegister = type === "register";
    const isLogin = type === "login";
    const isForgot = type === "forgot";
    const isAuthorized = type === "authorized";

    return [
      {
        id: "toolbarCurrentElement",
        type: "popover",
        config: {
          icon: "nc-form-left",
          title: t("Forms")
        },
        position: 60,
        options: [
          {
            id: "tabsCurrentElementFields",
            type: "tabs",
            config: { showSingle: true },
            tabs: [
              {
                id: "tabsCurrentElementField",
                label: t("Type"),
                options: [
                  {
                    id: "type",
                    type: "select",
                    label: t("Type"),
                    devices: "desktop",
                    choices: typeChoices
                  },
                  {
                    id: "defaultRoles",
                    type: "multiSelect",
                    label: t("Default Roles"),
                    devices: "desktop",
                    placeholder: t("none"),
                    disabled: !isRegister || is_wp,
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
                    type: "switch"
                  },
                  {
                    id: "showName",
                    type: "switch",
                    label: t("Full name"),
                    devices: "desktop",
                    disabled: !isAuthorized
                  },
                  {
                    id: "showFirstName",
                    label: t("First Name"),
                    devices: "desktop",
                    disabled: !isRegister || is_wp,
                    type: "switch"
                  },
                  {
                    id: "showLastName",
                    label: t("Last Name"),
                    devices: "desktop",
                    disabled: !isRegister || is_wp,
                    type: "switch"
                  },
                  {
                    id: "showUsername",
                    label: t("Username"),
                    devices: "desktop",
                    disabled: !isRegister || is_wp,
                    type: "switch"
                  },
                  {
                    id: "showPhoneNumber",
                    label: t("Phone Number"),
                    devices: "desktop",
                    disabled: !isRegister || is_wp,
                    type: "switch"
                  },
                  {
                    id: "showRegisterInfo",
                    label: t("Register Info"),
                    devices: "desktop",
                    disabled: !isRegister || is_cloud,
                    type: "switch"
                  },
                  {
                    id: "showLoginLink",
                    label: getShowLinkLabel(type),
                    devices: "desktop",
                    disabled: !isRegister && !isForgot,
                    type: "switch"
                  },
                  {
                    id: "showLostPassword",
                    label: t("Lost Password"),
                    devices: "desktop",
                    disabled: !isRegister && !isLogin,
                    type: "switch"
                  },
                  {
                    id: "showRegisterLink",
                    label: t("Register"),
                    devices: "desktop",
                    disabled: (!isForgot && !isLogin) || !canRegister,
                    type: "switch"
                  }
                ]
              }
            ]
          }
        ]
      },
      { id: "horizontalAlign", type: "toggle", disabled: true }
    ];
  };
