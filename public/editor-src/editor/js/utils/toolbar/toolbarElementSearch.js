import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementSearchStyle({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("searchStyle"),
    label: t("Style"),
    type: "select",
    devices,
    disabled,
    choices: [
      {
        title: t("Classic"),
        value: "classic"
      },
      {
        title: t("Minimal"),
        value: "minimal"
      }
    ],
    value: dvv("searchStyle")
  };
}
