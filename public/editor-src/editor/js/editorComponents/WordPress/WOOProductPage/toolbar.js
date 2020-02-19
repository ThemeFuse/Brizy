import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems({ device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    {
      id: dvk("toolbarWOOProductPage"),
      devices: "desktop",
      type: "popover",
      icon: "nc-woo-2",
      position: 10,
      options: [
        {
          id: "productID",
          label: t("Product ID"),
          type: "inputText-dev",
          devices: "desktop",
          placeholder: t("Product ID or SKU")
        }
      ]
    },
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      roles: ["admin"],
      icon: "nc-cog",
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
