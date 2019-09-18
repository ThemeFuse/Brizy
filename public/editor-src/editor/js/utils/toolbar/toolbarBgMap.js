import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarBgMapAddress({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("bgMapAddress"),
    label: t("Address"),
    type: "input",
    placeholder: t("Enter address"),
    devices,
    disabled,
    value: {
      value: dvv("bgMapAddress")
    },
    onChange: ({ value: bgMapAddress }) => ({
      bgMapAddress
    })
  };
}

export function toolbarBgMapZoom({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("bgMapZoom"),
    label: t("Zoom"),
    type: "slider",
    devices,
    disabled,
    slider: {
      min: 1,
      max: 21
    },
    input: {
      show: true,
      min: 1
    },
    value: {
      value: dvv("bgMapZoom")
    },
    onChange: ({ value: bgMapZoom }) => ({ bgMapZoom })
  };
}
