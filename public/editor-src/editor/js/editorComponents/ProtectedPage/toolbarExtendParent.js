import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-lock",
        title: t("Protected Page")
      },
      position: 60,
      options: [
        {
          id: "emptyMessage",
          type: "inputText-dev",
          label: t("Empty message"),
          placeholder: t("..type error message"),
          devices: "desktop",
          config: {
            size: "medium"
          }
        },
        {
          id: "invalidMessage",
          type: "inputText-dev",
          label: t("Invalid message"),
          placeholder: t("..type error message"),
          devices: "desktop",
          config: {
            size: "medium"
          }
        },
        {
          id: "failMessage",
          type: "inputText-dev",
          label: t("Fail message"),
          placeholder: t("..type error message"),
          devices: "desktop",
          config: {
            size: "medium"
          }
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
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 10,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings")
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
    }
  ];
}
