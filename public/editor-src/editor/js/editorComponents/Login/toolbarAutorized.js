import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );

  return [
    {
      id: "popoverLogout",
      type: "popover",
      config: {
        icon: "nc-link",
        title: t("Logout"),
        size: "medium"
      },
      position: 60,
      options: [
        {
          id: "redirectGroup",
          type: "group",
          options: [
            {
              id: "logoutRedirectType",
              type: "select",
              label: t("Redirect After Logout"),
              devices: "desktop",
              choices: [
                { title: t("Same Page"), value: "samePage" },
                { title: t("Custom"), value: "custom" }
              ]
            },
            {
              id: "logoutRedirect",
              label: t("URL"),
              type: "inputText",
              disabled: dvv("logoutRedirectType") !== "custom",
              devices: "desktop",
              placeholder: "http://"
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "text",
          type: "typography",
          config: {
            fontFamily: "desktop" === device
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColor
          }
        }
      },
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "textColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabLink",
              label: t("Link"),
              options: [
                {
                  id: "linkColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "autorizedHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    }
  ];
}
