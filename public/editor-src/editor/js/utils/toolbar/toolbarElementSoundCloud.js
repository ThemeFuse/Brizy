import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementSoundCloudStyle({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("style"),
    label: t("Style"),
    type: "radioGroup",
    devices,
    disabled,
    choices: [
      {
        value: "basic",
        icon: "nc-sndcloud-style-1"
      },
      {
        value: "artwork",
        icon: "nc-sndcloud-style-2"
      }
    ],
    value: dvv("style"),
    onChange: value => ({
      [dvk("style")]: value,
      [dvk("showArtwork")]: value === "basic" ? "off" : "on",
      [dvk("height")]:
        value === "basic"
          ? dvv("mediumHeight")
          : value === "artwork"
          ? dvv("largeHeight")
          : dvv("height")
    })
  };
}
