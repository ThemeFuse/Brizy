import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementRowColumnsHeight({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("columnsHeight"),
    devices,
    disabled,
    type: "slider",
    slider: {
      min: 20,
      max: 500
    },
    input: {
      show: true,
      min: 0
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "px",
          value: "px"
        }
      ]
    },
    value: {
      value: dvv("columnsHeight")
    },
    onChange: ({ value: columnsHeight }) => ({
      columnsHeight
    })
  };
}
