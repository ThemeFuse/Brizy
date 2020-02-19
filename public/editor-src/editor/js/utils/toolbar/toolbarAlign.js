import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function toolbarVerticalAlign({
  v,
  device,
  state,
  position = 110,
  prefix = "",
  disabled = false,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk(capByPrefix(prefix, "verticalAlign")),
    label: t("Content"),
    type: "radioGroup",
    devices,
    position,
    disabled,
    choices: [
      {
        value: "top",
        icon: "nc-align-top"
      },
      {
        value: "center",
        icon: "nc-align-middle"
      },
      {
        value: "bottom",
        icon: "nc-align-bottom"
      }
    ],
    value: dvv(capByPrefix(prefix, "verticalAlign"))
  };
}
