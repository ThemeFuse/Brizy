import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarGradientType({
  v,
  device,
  state,
  states,
  devices = "all",
  className,
  disabled
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("gradientType"),
    type: "select",
    devices,
    states,
    disabled,
    className,
    choices: [
      {
        title: t("Linear"),
        value: "linear"
      },
      {
        title: t("Radial"),
        value: "radial"
      }
    ],
    value: dvv("gradientType")
  };
}

export function toolbarGradientLinearDegree({
  states,
  devices = "all",
  disabled
}) {
  return {
    id: "gradientLinearDegree",
    type: "number-dev",
    className: "brz-ed-grid__gradient__size brz-ed-option__input-number-wrap",
    devices,
    states,
    disabled,
    config: {
      min: 0,
      max: 360,
      size: "auto",
      spinner: false
    }
  };
}

export function toolbarGradientRadialDegree({
  states,
  devices = "all",
  disabled
}) {
  return {
    id: "gradientRadialDegree",
    type: "number-dev",
    className: "brz-ed-grid__gradient__degree brz-ed-option__input-number-wrap",
    devices: devices,
    states: states,
    disabled: disabled,
    config: {
      min: 0,
      spinner: false,
      size: "auto",
      max: 1000
    }
  };
}
