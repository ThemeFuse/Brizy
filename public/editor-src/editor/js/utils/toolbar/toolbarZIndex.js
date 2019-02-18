import { t } from "visual/utils/i18n";

export function toolbarZIndex({ v, position = 20 }) {
  return {
    type: "slider",
    id: "zIndex",
    position,
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
