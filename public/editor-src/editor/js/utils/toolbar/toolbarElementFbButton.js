import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementFbButtonSize({
  v,
  device,
  disabled = false,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "size", device, state }),
    label: t("Size"),
    disabled,
    devices,
    type: "radioGroup",
    choices: [
      {
        icon: "nc-small",
        value: "small"
      },
      {
        icon: "nc-large",
        value: "large"
      }
    ],
    value: defaultValueValue({ v, key: "size", device, state })
  };
}
