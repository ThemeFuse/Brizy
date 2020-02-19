import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementVideoStart({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("start"),
    devices,
    disabled,
    label: t("Start"),
    helper: true,
    helperContent: t("Specify a start time (in seconds)"),
    type: "input",
    inputType: "number",
    placeholder: "seconds",
    roles: ["admin"],
    value: {
      value: v.start
    },
    onChange: ({ value }) => ({
      [dvk("start")]: Number(value)
    })
  };
}

export function toolbarElementVideoEnd({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("end"),
    devices,
    disabled,
    label: t("End"),
    helper: true,
    helperContent: t("Specify an end time (in seconds)"),
    type: "input",
    inputType: "number",
    placeholder: "seconds",
    roles: ["admin"],
    value: {
      value: v.end
    },
    onChange: ({ value }) => ({
      [dvk("end")]: Number(value)
    })
  };
}

export function toolbarElementVideoPlaySize({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("iconSize"),
    label: t("Play"),
    type: "slider",
    devices,
    disabled,
    roles: ["admin"],
    slider: {
      min: 50,
      max: 200
    },
    input: {
      show: true,
      min: 50,
      max: 200
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
      value: dvv("iconSize")
    },
    onChange: ({ value }) => {
      return {
        [dvk("iconSize")]: value,
        [dvk("iconSizeWidth")]: value,
        [dvk("iconSizeHeight")]: value
      };
    }
  };
}

export function toolbarElementVideoUpload({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    id: dvk("custom"),
    label: t("File"),
    type: "fileUpload",
    acceptedExtensions: ["video/*"],
    devices,
    disabled,
    value: dvv("custom")
  };
}

export function toolbarElementVideoControls({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    type: "multiPicker",
    roles: ["admin"],
    devices,
    disabled,
    picker: {
      id: dvk("controls"),
      label: t("Controls"),
      devices,
      disabled,
      type: "switch",
      roles: ["admin"],
      value: dvv("controls")
    },
    choices: {
      on: [
        {
          id: dvk("controlsIconCustomSize"),
          type: "slider",
          label: t("Size"),
          disabled: v.type !== "custom",
          slider: {
            min: 1,
            max: 40
          },
          input: {
            show: true
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
            value: dvv("controlsIconCustomSize")
          },
          onChange: ({ value: controlsIconCustomSize }) => {
            return {
              [dvk("controlsIconCustomSize")]: controlsIconCustomSize
            };
          }
        }
      ]
    }
  };
}
