import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarZIndex({
  v,
  device,
  state,
  position = 20,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("zIndex"),
    type: "slider",
    position,
    label: t("Z-index"),
    devices,
    slider: {
      min: 0,
      max: 100
    },
    input: {
      show: true,
      min: 0
    },
    value: {
      value: dvv("zIndex")
    },
    onChange: ({ value }) => ({
      [dvk("zIndex")]: value
    })
  };
}
