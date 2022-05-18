import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  return [
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          config: {
            min: dvv("heightSuffix") === "px" ? 10 : 1,
            max: dvv("heightSuffix") === "px" ? 200 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "vh", title: "vh" },
              { value: "em", title: "em" }
            ]
          }
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    }
  ];
}
