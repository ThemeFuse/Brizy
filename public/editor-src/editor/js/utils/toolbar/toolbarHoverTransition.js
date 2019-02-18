import { t } from "visual/utils/i18n";

export function toolbarHoverTransition({ v, position = 50 }) {
  return {
    id: "hoverTransition",
    label: t("Hover Transition"),
    position,
    type: "slider",
    slider: {
      min: 0,
      max: 99
    },
    input: {
      show: true,
      min: 0,
      max: 99
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "ms",
          value: "ms"
        }
      ]
    },
    value: {
      value: v.hoverTransition
    },
    onChange: ({ value: hoverTransition }) => ({ hoverTransition })
  };
}
