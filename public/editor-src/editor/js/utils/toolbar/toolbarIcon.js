import { t } from "visual/utils/i18n";
import { capitalize } from "visual/utils/string";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarIconSize({ v, device, devices = "all", state }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  return {
    type: "multiPicker",
    roles: ["admin"],
    devices,
    picker: {
      id: dvk("iconSize"),
      label: t("Size"),
      type: "radioGroup",
      choices: [
        {
          value: "small",
          icon: "nc-16"
        },
        {
          value: "medium",
          icon: "nc-24"
        },
        {
          value: "large",
          icon: "nc-32"
        },
        {
          value: "custom",
          icon: "nc-more"
        }
      ],
      value: dvv("iconSize"),
      onChange: value => {
        return {
          [dvk("iconSize")]: value,

          [dvk("iconCustomSize")]:
            value !== "custom"
              ? dvv(`icon${capitalize(value)}Size`)
              : dvv("iconCustomSize")
        };
      }
    },
    choices: {
      custom: [
        {
          id: dvk("iconCustomSize"),
          type: "slider",
          slider: {
            min: 8,
            max: 50
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
            value: dvv("iconCustomSize")
          },
          onChange: ({ value }) => {
            return {
              [dvk("iconCustomSize")]: value
            };
          }
        }
      ]
    }
  };
}
