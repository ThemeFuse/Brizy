import { t } from "visual/utils/i18n";

export function toolbarBgMapAddress({ v, disabled = false }) {
  return {
    id: "bgMapAddress",
    label: t("Address"),
    type: "input",
    placeholder: t("Enter address"),
    disabled,
    value: {
      value: v.bgMapAddress
    },
    onChange: ({ value: bgMapAddress }) => ({
      bgMapAddress
    })
  };
}

export function toolbarBgMapZoom({ v, disabled = false }) {
  return {
    id: "bgMapZoom",
    label: t("Zoom"),
    type: "slider",
    disabled,
    slider: {
      min: 1,
      max: 21
    },
    input: {
      show: true,
      min: 1
    },
    value: {
      value: v.bgMapZoom
    },
    onChange: ({ value: bgMapZoom }) => ({ bgMapZoom })
  };
}
