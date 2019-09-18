import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementRowColumnsHeightStyle({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("columnsHeightStyle"),
    label: t("Height"),
    type: "select",
    devices,
    choices: [
      {
        title: t("Auto"),
        value: "auto"
      },
      {
        title: t("Custom"),
        value: "custom"
      }
    ],
    value: dvv("columnsHeightStyle")
  };
}

export function toolbarElementRowColumnsHeight({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("columnsHeight"),
    devices,
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
