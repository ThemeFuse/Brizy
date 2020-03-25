import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import { toolbarElementWPCustomShortCode } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    {
      id: defaultValueKey({
        key: "toolbarWPCustomShortcode",
        device,
        state: "normal"
      }),
      type: "popover",
      icon: "nc-wp-shortcode",
      size: "large",
      devices: "desktop",
      position: 10,
      options: [
        toolbarElementWPCustomShortCode({
          v,
          device,
          devices: "desktop",
          state: "normal"
        })
      ]
    },
    {
      id: defaultValueKey({ key: "toolbarSettings", device, state: "normal" }),
      type: "popover",
      icon: "nc-cog",
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
