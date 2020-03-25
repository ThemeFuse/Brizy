import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementAudioUpload({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    id: dvk("audio"),
    label: t("File"),
    type: "fileUpload",
    acceptedExtensions: [".mp3", ".ogg", ".wav"],
    devices,
    disabled,
    value: dvv("audio")
  };
}

export function toolbarElementAudioIconSize({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    type: "multiPicker",
    roles: ["admin"],
    devices,
    disabled,
    picker: {
      id: dvk("iconSize"),
      devices,
      label: t("Icons"),
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
      onChange: iconSize => {
        return {
          [dvk("iconSize")]: iconSize,
          iconCustomSize:
            iconSize === "small"
              ? dvv("smallIconSize")
              : iconSize === "medium"
              ? dvv("mediumIconSize")
              : iconSize === "large"
              ? dvv("largeIconSize")
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
            min: 1,
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
            value: dvv("iconCustomSize")
          },
          onChange: ({ value: iconCustomSize }) => {
            return {
              [dvk("iconCustomSize")]: iconCustomSize
            };
          }
        }
      ]
    }
  };
}
