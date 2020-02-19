import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementCounterStart({
  v,
  device,
  devices = "all",
  state,
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("start"),
    label: t("Start"),
    type: "input",
    inputType: "number",
    inputSize: "small",
    devices,
    disabled,
    value: {
      value: dvv("start")
    },
    onChange: ({ value }) => ({
      [dvk("start")]: value
    })
  };
}

export function toolbarElementCounterEnd({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("end"),
    label: t("End"),
    type: "input",
    inputType: "number",
    inputSize: "small",
    devices,
    disabled,
    value: {
      value: dvv("end")
    },
    onChange: ({ value }) => ({
      [dvk("end")]: value
    })
  };
}

export function toolbarElementCounterStyles({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("type"),
    label: t("Styles"),
    type: "select",
    devices,
    choices: [
      {
        title: t("Style 1"),
        value: "simple"
      },
      {
        title: t("Style 2"),
        value: "radial"
      },
      {
        title: t("Style 3"),
        value: "empty"
      },
      {
        title: t("Style 4"),
        value: "pie"
      }
    ],
    disabled,
    value: dvv("type"),
    onChange: value => ({
      [dvk("type")]: value,
      [dvk("start")]: dvv("type") !== "simple" ? dvv("start") : 0
    })
  };
}
