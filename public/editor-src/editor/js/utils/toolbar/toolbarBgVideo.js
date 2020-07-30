import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarBgVideoUrl({
  v,
  device,
  devices = "all",
  state,
  states,
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("bgVideo"),
    label: t("URL"),
    type: "input",
    inputType: "video",
    placeholder: t("YouTube or Vimeo"),
    disabled,
    devices,
    states,
    value: {
      value: dvv("bgVideo")
    },
    onChange: ({ value: bgVideo }) => ({
      bgVideo,

      bgColorOpacity:
        bgVideo !== "" && dvv("bgColorOpacity") === 1
          ? 0.8
          : dvv("bgColorOpacity"),

      tempBgColorOpacity:
        bgVideo !== "" && dvv("bgColorOpacity") === 1
          ? 0.8
          : dvv("tempBgColorOpacity")
    })
  };
}
