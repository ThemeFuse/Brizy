import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

const helperHTML = `
<span>Add your custom class without the .dot, example: my-class</span>`;

export function toolbarCustomCSSClass({
  v,
  position = 40,
  device,
  state,
  devices = "all"
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("customClassName"),
    label: t("CSS Class"),
    position,
    display: "block",
    type: "input",
    devices,
    helper: true,
    helperContent: helperHTML,
    value: {
      value: dvv("customClassName")
    },
    onChange: ({ value }) => ({
      [dvk("customClassName")]: value
    })
  };
}
