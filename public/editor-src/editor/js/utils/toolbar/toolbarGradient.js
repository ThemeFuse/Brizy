export function toolbarGradientLinearDegree({
  states,
  devices = "all",
  disabled
}) {
  return {
    id: "gradientLinearDegree",
    type: "number",
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
    type: "number",
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
