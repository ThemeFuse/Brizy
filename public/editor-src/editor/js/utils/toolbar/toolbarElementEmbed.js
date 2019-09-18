import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";

export function toolbarElementEmbedCode({ v, device, devices = "all", state }) {
  return {
    id: defaultValueKey({ key: "code", device }),
    devices,
    type: "textarea",
    placeholder: t("Paste your code here..."),
    value: defaultValueValue({ v, key: "code", device, state })
  };
}
