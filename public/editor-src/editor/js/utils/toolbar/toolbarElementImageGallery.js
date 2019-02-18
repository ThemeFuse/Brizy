import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementImageGalleryGridColumn({ v, device }) {
  return {
    id: defaultValueKey({ key: "gridColumn", device }),
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
        device
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "gridColumn", device })]: value
    })
  };
}

export function toolbarElementImageGallerySpacing({ v, device }) {
  return {
    id: defaultValueKey({ key: "spacing", device }),
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
        device
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ key: "spacing", device })]: value
    })
  };
}

export function toolbarElementImageGalleryLightBox({ v }) {
  return {
    id: "lightBox",
    label: t("Open in Lightbox"),
    type: "switch",
    value: v.lightBox
  };
}
