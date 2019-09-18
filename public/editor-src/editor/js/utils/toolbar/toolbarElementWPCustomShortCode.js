import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementWPCustomShortCode({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "shortcode", device, state }),
    devices,
    type: "textarea",
    placeholder: t("Paste your WordPress shortcode here ..."),
    value: defaultValueValue({ v, key: "shortcode", device, state })
  };
}
