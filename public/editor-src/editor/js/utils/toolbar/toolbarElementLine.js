import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementLineBorderStyle({ v }) {
  return {
    id: "borderStyle",
    label: t("Style"),
    type: "radioGroup",
    choices: [
      {
        value: "solid",
        icon: "nc-solid"
      },
      {
        value: "dashed",
        icon: "nc-dashed"
      },
      {
        value: "dotted",
        icon: "nc-dotted"
      }
    ],
    value: v.borderStyle
  };
}

export function toolbarElementLineBorderWidth({ v, device }) {
  return {
    id: defaultValueKey({ key: "borderWidth", device }),
    label: t("Size"),
    type: "slider",
    roles: ["admin"],
    slider: {
      min: 1,
      max: 10
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
      value: defaultValueValue({
        v,
        key: "borderWidth",
        device
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "borderWidth", device })]: value
    })
  };
}
