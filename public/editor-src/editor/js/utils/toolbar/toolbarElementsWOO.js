import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementWOOCategoriesOrder({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    type: "multiPicker",
    picker: {
      id: dvk("order"),
      devices,
      label: t("Order"),
      type: "radioGroup",
      choices: [
        {
          value: "ASC",
          icon: "nc-up"
        },
        {
          value: "DESC",
          icon: "nc-down"
        }
      ],
      value: dvv("order")
    }
  };
}

export function toolbarElementWOOProductsOrder({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    type: "multiPicker",
    picker: {
      id: dvk("order"),
      devices,
      label: t("Order"),
      type: "radioGroup",
      choices: [
        {
          value: "ASC",
          icon: "nc-up"
        },
        {
          value: "DESC",
          icon: "nc-down"
        }
      ],
      value: dvv("order")
    }
  };
}
