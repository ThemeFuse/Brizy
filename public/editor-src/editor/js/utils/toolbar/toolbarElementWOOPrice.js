import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementWOOPriceSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("spacing"),
    label: t("Spacing"),
    type: "slider",
    slider: {
      min: 0,
      max: 20
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
      value: dvv("spacing")
    },
    onChange: ({ value: spacing }) => {
      return { [dvk("spacing")]: spacing };
    }
  };
}
