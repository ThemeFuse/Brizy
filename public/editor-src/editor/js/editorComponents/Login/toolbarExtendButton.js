import { t } from "visual/utils/i18n";

export function getItems({ v }) {
  return [
    {
      id: "popoverLink",
      type: "popover-dev",
      config: {
        icon: "nc-link",
        title: t("Link"),
        size: "medium"
      },
      position: 90,
      options: [
        {
          id: "redirectGroup",
          type: "group-dev",
          options: [
            {
              id: "redirectType",
              type: "select-dev",
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
              type: "inputText-dev",
              disabled: v.redirectType !== "custom",
              devices: "desktop",
              placeholder: "http://"
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "submitWidth",
          label: t("Width"),
          type: "slider-dev",
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
      type: "toggle-dev",
      position: 100,
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
      ]
    }
  ];
}
