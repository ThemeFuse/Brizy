import { t } from "visual/utils/i18n";

export function toolbarZIndex({ v }) {
  return {
    type: "slider",
    id: "zIndex",
    label: t("Z-index"),
    slider: {
      min: 0,
      max: 100
    },
    input: {
      show: true,
      min: 0
    },
    value: {
      value: v.zIndex
    },
    onChange: ({ value: zIndex }) => ({
      zIndex
    })
  };
}
