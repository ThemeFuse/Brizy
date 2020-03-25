import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarBgVideoUrl({
  v,
  device,
  devices = "all",
  state,
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

export function toolbarBgVideoLoop({
  v,
  device,
  devices = "all",
  state,
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("bgVideoLoop"),
    label: t("Loop"),
    type: "switch",
    devices,
    disabled,
    value: dvv("bgVideoLoop")
  };
}

export function toolbarBgVideoStart({
  v,
  device,
  devices = "all",
  state,
  disabled = false
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("bgVideoStart"),
    devices,
    label: t("Start"),
    type: "input",
    inputType: "number",
    placeholder: "seconds",
    disabled,
    value: {
      value: dvv("bgVideoStart")
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ key: "bgVideoStart", device, state })]: Number(value)
    })
  };
}
