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
          label: "Empty message",
          placeholder: "..type error message",
          devices: "desktop"
        },
        {
          id: "invalidMessage",
          type: "inputText-dev",
          label: "Invalid message",
          placeholder: "..type error message",
          devices: "desktop"
        },
        {
          id: "failMessage",
          type: "inputText-dev",
          label: "Fail message",
          placeholder: "..type error message",
          devices: "desktop"
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
