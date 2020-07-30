import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { t } from "visual/utils/i18n";

export function toolbarElementLoginSpacingPx({
  v,
  device,
  state,
  prefix = "field",
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    devices,
    id: dvk(capByPrefix(prefix, "padding")),
    type: "slider",
    label: t("Spacing"),
    slider: {
      min: 0,
      max: 100
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [{ title: "px", value: "px" }]
    },
    value: {
      value: dvv(capByPrefix(prefix, "padding"))
    },
    onChange: ({ value }) => ({
      [dvk(capByPrefix(prefix, "padding"))]: value,
      [dvk(capByPrefix(prefix, "paddingRight"))]: value,
      [dvk(capByPrefix(prefix, "paddingBottom"))]: value,
      [dvk(capByPrefix(prefix, "paddingLeft"))]: value
    })
  };
}
