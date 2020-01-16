import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

const helperHTML = `
<span>Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character.</span>`;

export function toolbarAttributes({
  v,
  device,
  state,
  devices = "all",
  position = 45
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("customAttributes"),
    type: "codeMirror",
    label: t("Custom Attributes"),
    position,
    display: "block",
    devices,
    helper: true,
    helperContent: helperHTML,
    placeholder: "key1:value1\nkey2:value2",
    value: dvv("customAttributes")
  };
}
