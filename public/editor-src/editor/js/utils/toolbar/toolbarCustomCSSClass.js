import { t } from "visual/utils/i18n";

export function toolbarCustomCSSClass({ v, position = 40 }) {
  return {
    id: "customClassName",
    label: t("CSS Class"),
    position,
    display: "block",
    type: "input",
    value: {
      value: v.customClassName
    },
    onChange: ({ value: customClassName }) => ({
      customClassName
    })
  };
}
