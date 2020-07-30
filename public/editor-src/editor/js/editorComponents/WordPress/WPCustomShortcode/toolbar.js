import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems({ device }) {
  return [
    {
      id: "toolbarWPCustomShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-wp-shortcode",
        size: "large"
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "shortcode",
          type: "textarea-dev",
          devices: "desktop",
          placeholder: t("Paste your WordPress shortcode here ...")
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: defaultValueKey({
            key: "advancedSettings",
            device,
            state: "normal"
          }),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
