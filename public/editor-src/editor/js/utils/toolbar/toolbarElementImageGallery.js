import { t } from "visual/utils/i18n";

export function toolbarElementImageGalleryFilterSpacing() {
  return {
    id: "filterSpacing",
    type: "slider-dev",
    label: t("Spacing"),
    config: {
      min: 0,
      max: 20,
      units: [{ value: "px", title: "px" }]
    }
  };
}
export function toolbarElementImageGalleryFilterAfterSpacing() {
  return {
    id: "afterFilterSpacing",
    type: "slider-dev",
    label: t("After spacing"),
    config: {
      min: 0,
      max: 100,
      units: [{ value: "px", title: "px" }]
    }
  };
}

export function toolbarElementImageGalleryStyle() {
  return {
    id: "filterStyle",
    type: "select-dev",
    label: t("Style"),
    choices: [
      { value: "style-1", title: "Style 1" },
      { value: "style-2", title: "Style 2" }
    ],
    value: {
      value: "style-1"
    }
  };
}
