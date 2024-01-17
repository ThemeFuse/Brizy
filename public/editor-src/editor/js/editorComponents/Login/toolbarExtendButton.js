import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

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
          id: "redirectGroup",
          type: "group",
          options: [
            {
              id: "redirectType",
              type: "select",
              label: t("Redirect After Login"),
              devices: "desktop",
              choices: [
                { title: t("Same Page"), value: "samePage" },
                { title: t("Custom"), value: "custom" }
              ]
            },
            {
              id: "messageRedirect",
              label: t("URL"),
              type: "inputText",
              disabled: dvv("redirectType") !== "custom",
              devices: "desktop",
              placeholder: "http://",
              config: {
                size: "medium"
              }
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
    }
  ];
}
