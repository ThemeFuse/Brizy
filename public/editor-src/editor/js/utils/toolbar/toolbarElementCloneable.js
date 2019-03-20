import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementCloneableSpacing({ v, device, position = 350 }) {
  return {
    id: defaultValueKey({ key: "itemPadding", device }),
    type: "slider",
    label: t("Spacing"),
    roles: ["admin"],
    position,
    slider: {
      min: 0,
      max: 100
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
    disabled: v.items.length === 1,
    value: {
      value: defaultValueValue({
        v,
        key: "itemPadding",
        device
      })
    },
    onChange: ({ value }) => {
      return {
        [defaultValueKey({ key: "itemPadding", device })]: value,
        [defaultValueKey({
          key: "itemPaddingRight",
          device
        })]: value,
        [defaultValueKey({
          key: "itemPaddingLeft",
          device
        })]: value
      };
    }
  };
}
