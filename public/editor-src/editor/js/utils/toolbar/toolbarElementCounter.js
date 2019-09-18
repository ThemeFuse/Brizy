import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementCounterStart({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "start", device, state }),
    label: t("Start"),
    type: "input",
    inputType: "number",
    inputSize: "small",
    devices,
    value: {
      value: defaultValueValue({
        v,
        key: "start",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "start", device, state })]: value
    })
  };
}

export function toolbarElementCounterEnd({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "end", device, state }),
    label: t("End"),
    type: "input",
    inputType: "number",
    inputSize: "small",
    devices,
    value: {
      value: defaultValueValue({
        v,
        key: "end",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "end", device, state })]:
        value !== "" ? value : 0
    })
  };
}

export function toolbarElementCounterDuration({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "duration", device, state }),
    label: t("Duration"),
    type: "slider",
    devices,
    slider: {
      min: 0,
      step: 0.5,
      max: 25
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "sec",
          value: "sec"
        }
      ]
    },
    value: {
      value: defaultValueValue({
        v,
        key: "duration",
        device,
        state
      })
    },
    onChange: ({ value }) => {
      return {
        [defaultValueKey({ v, key: "duration", device, state })]: value
      };
    }
  };
}
