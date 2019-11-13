import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementPostInfoSpacing({
  v,
  device,
  devices = "all",
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("textSpacing"),
    label: t("Spacing"),
    type: "slider",
    roles: ["admin"],
    devices,
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
    value: {
      value: dvv("textSpacing")
    },
    onChange: ({ value: textSpacing }) => {
      return {
        [dvk("textSpacing")]: textSpacing
      };
    }
  };
}
