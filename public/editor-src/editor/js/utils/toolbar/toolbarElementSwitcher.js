import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementSwitcherStyle({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    type: "multiPicker",
    roles: ["admin"],
    devices,
    picker: {
      id: dvk("switcherStyle"),
      label: t("Style"),
      type: "radioGroup",
      devices,
      choices: [
        {
          value: "style-1",
          icon: "nc-switcher-style-1"
        },
        {
          value: "style-2",
          icon: "nc-switcher-style-2"
        }
      ],
      value: dvv("switcherStyle"),
      onChange: value => ({
        [dvk("switcherStyle")]: value
      })
    }
  };
}
