import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementCounterStyles({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("type"),
    label: t("Style"),
    type: "radioGroup",
    disabled,
    devices,
    choices: [
      {
        value: "simple",
        icon: "nc-counter-style-1"
      },
      {
        value: "radial",
        icon: "nc-counter-style-2"
      },
      {
        value: "empty",
        icon: "nc-counter-style-3"
      },
      {
        value: "pie",
        icon: "nc-counter-style-4"
      }
    ],
    value: dvv("type"),
    onChange: value => ({
      [dvk("type")]: value,
      [dvk("start")]: dvv("type") !== "simple" ? dvv("start") : 0
    })
  };
}
