import { t } from "visual/utils/i18n";

export function toolbarCustomCSSClass({ v }) {
  return {
    id: "customClassName",
    label: t("CSS Class"),
    type: "input",
    inputSize: "auto",
    value: {
      value: v.customClassName
    },
    onChange: ({ value: customClassName }) => ({
      customClassName
    })
  };
}
