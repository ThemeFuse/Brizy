import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarHorizontalAlign({
  v,
  device,
  devices = "all",
  state,
  position = 100
}) {
  return {
    id: defaultValueKey({ key: "horizontalAlign", device, state }),
    type: "toggle",
    devices,
    position,
    choices: [
      {
        icon: "nc-text-align-left",
        title: t("Align"),
        value: "left"
      },
      {
        icon: "nc-text-align-center",
        title: t("Align"),
        value: "center"
      },
      {
        icon: "nc-text-align-right",
        title: t("Align"),
        value: "right"
      }
    ],
    value: defaultValueValue({ v, key: "horizontalAlign", device, state }),
    onChange: value => ({
      [defaultValueKey({ key: "horizontalAlign", device, state })]: value
    })
  };
}

export function toolbarVerticalAlign({ v, device, state, devices = "all" }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("verticalAlign"),
    label: t("Content"),
    type: "radioGroup",
    devices,
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
    value: dvv("verticalAlign")
  };
}
