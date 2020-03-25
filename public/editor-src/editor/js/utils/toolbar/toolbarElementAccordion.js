import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementAccordionStyle({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("filterStyle"),
    label: t("Style"),
    type: "radioGroup",
    devices,
    choices: [
      {
        value: "style-1",
        icon: "nc-tags-style-2"
      },
      {
        value: "style-2",
        icon: "nc-tags-style-1"
      }
    ],
    value: dvv("filterStyle"),
    onChange: value => ({
      [dvk("filterStyle")]: value
    })
  };
}
