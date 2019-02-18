import { t } from "visual/utils/i18n";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarBorderStyle({ v, device, state, onChange }) {
  const borderStyleKey = defaultValueKey({ key: "borderStyle", device, state });
  const borderStyleValue = defaultValueValue({
    v,
    key: "borderStyle",
    device,
    state
  });

  return {
    id: borderStyleKey,
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
      },
      {
        value: "",
        icon: "nc-close"
      }
    ],
    value: borderStyleValue,
    onChange: value => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ value }
      };
      return saveOnChanges(values);
    }
  };
}
