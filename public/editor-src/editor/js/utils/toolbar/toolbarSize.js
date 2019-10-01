import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarSizeSizeSizePercent({
  v,
  device,
  devices = "all",
  state,
  min = 1,
  max = 100,
  position = 80,
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("size"),
    label: t("Size"),
    type: "slider",
    devices,
    position,
    disabled,
    slider: {
      min,
      max
    },
    input: {
      show: true,
      min,
      max
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "%",
          value: "%"
        }
      ]
    },
    value: {
      value: dvv("size")
    },
    onChange: ({ value }) => ({
      [dvk("size")]: value
    })
  };
}

export function toolbarSizeWidthWidthPercent({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "width", device, state }),
    label: t("Width"),
    devices,
    type: "slider",
    slider: {
      min: 1,
      max: 100
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "%",
          value: "%"
        }
      ]
    },
    value: {
      value: defaultValueValue({ v, key: "width", device, state })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ key: "width", device, state })]: value
    })
  };
}

export function toolbarSizeHeightHeightPx({
  v,
  device,
  state,
  config,
  devices = "all"
}) {
  return {
    id: defaultValueKey({ key: "height", device, state }),
    label: t("Height"),
    type: "slider",
    devices,
    slider: {
      min: config.slider.min,
      max: config.slider.max
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
      value: defaultValueValue({ v, key: "height", device, state })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ key: "height", device, state })]: value
    })
  };
}

export function toolbarSizeContainerSize({
  v,
  device,
  state,
  devices = "all"
}) {
  return {
    id: defaultValueKey({
      key: "containerSize",
      device,
      state
    }),
    label: t("Width"),
    type: "slider",
    devices,
    position: 100,
    slider: {
      min: 35,
      max: 100
    },
    input: {
      show: true,
      min: 35,
      max: 100
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "%",
          value: "%"
        }
      ]
    },
    value: {
      value: defaultValueValue({
        v,
        key: "containerSize",
        device,
        state
      })
    },
    onChange: ({ value: containerSize }) => ({
      containerSize
    })
  };
}
