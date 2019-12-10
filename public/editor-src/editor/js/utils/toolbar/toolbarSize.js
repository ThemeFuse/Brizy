import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

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

export function toolbarSizeWidthSizePercent({
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
    label: t("Width"),
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
  state,
  prefix = "",
  devices = "all"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  const width = capByPrefix(prefix, "width");

  return {
    devices,
    id: dvk(width),
    label: t("Width"),
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
      choices: [{ title: "%", value: "%" }]
    },
    value: {
      value: dvv(width)
    },
    onChange: ({ value }) => ({
      [dvk(width)]: value
    })
  };
}

export function toolbarSizeHeightHeightPx({
  v,
  device,
  state,
  config,
  devices = "all",
  disabled = false
}) {
  return {
    id: defaultValueKey({ key: "height", device, state }),
    label: t("Height"),
    type: "slider",
    devices,
    disabled,
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

export function toolbarSizeSpacing({ v, device, devices = "all", state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("spacing"),
    label: t("Spacing"),
    type: "slider",
    devices,
    roles: ["admin"],
    slider: {
      min: 0,
      max: 100
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
      value: dvv("spacing")
    },
    onChange: ({ value: spacing }) => {
      return {
        [dvk("spacing")]: spacing
      };
    }
  };
}
