import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementImageGalleryGridColumn({ v, device, state }) {
  return {
    id: defaultValueKey({ key: "gridColumn", device, state }),
    label: t("Columns"),
    type: "slider",
    slider: {
      min: 1,
      max: 6
    },
    input: {
      show: true,
      max: 6
    },
    value: {
      value: defaultValueValue({
        v,
        key: "gridColumn",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "gridColumn", device, state })]: value
    })
  };
}

export function toolbarElementImageGallerySpacing({ v, device, state }) {
  return {
    id: defaultValueKey({ key: "spacing", device, state }),
    label: t("Spacing"),
    type: "slider",
    slider: {
      min: 0,
      max: 20
    },
    input: {
      show: true,
      min: 0,
      max: 20
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
      value: defaultValueValue({
        v,
        key: "spacing",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ key: "spacing", device, state })]: value
    })
  };
}

export function toolbarElementImageGalleryLightBox({
  v,
  device,
  state,
  devices = "all"
}) {
  return {
    id: defaultValueKey({ v, key: "lightBox", device, state }),
    label: t("Open in Lightbox"),
    type: "switch",
    devices,
    value: defaultValueValue({ v, key: "lightBox", device, state })
  };
}
