import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementTabsIconPosition({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("iconPosition"),
    label: t("Position"),
    type: "radioGroup",
    choices: [
      {
        value: "left",
        icon: "nc-align-left"
      },
      {
        value: "right",
        icon: "nc-align-right"
      }
    ],
    value: dvv("iconPosition"),
    onChange: value => ({
      [dvk("iconPosition")]: value
    })
  };
}
