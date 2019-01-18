import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarSizeWidthWidthPercent({ v, device, state }) {
  return {
    id: defaultValueKey({ key: "width", device, state }),
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

export function toolbarSizeHeightHeightPx({ v, device, state, config }) {
  return {
    id: defaultValueKey({ key: "height", device, state }),
    label: t("Height"),
    type: "slider",
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
