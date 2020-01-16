import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarHoverTransition({
  v,
  position = 150,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("hoverTransition"),
    label: t("Hover Transition"),
    devices,
    position,
    type: "slider",
    slider: {
      min: 0,
      max: 99
    },
    input: {
      show: true,
      min: 0,
      max: 99
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "ms",
          value: "ms"
        }
      ]
    },
    value: {
      value: dvv("hoverTransition")
    },
    onChange: ({ value }) => ({
      [dvk("hoverTransition")]: value
    })
  };
}
