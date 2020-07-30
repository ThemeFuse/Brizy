import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementVideoPlaySize({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("iconSize"),
    label: t("Play"),
    type: "slider",
    devices,
    disabled,
    roles: ["admin"],
    slider: {
      min: 50,
      max: 200
    },
    input: {
      show: true,
      min: 50,
      max: 200
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
      value: dvv("iconSize")
    },
    onChange: ({ value }) => {
      return {
        [dvk("iconSize")]: value,
        [dvk("iconSizeWidth")]: value,
        [dvk("iconSizeHeight")]: value
      };
    }
  };
}

export function toolbarElementVideoUpload({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    id: dvk("custom"),
    label: t("File"),
    type: "fileUpload",
    acceptedExtensions: ["video/*"],
    devices,
    disabled,
    value: dvv("custom")
  };
}
