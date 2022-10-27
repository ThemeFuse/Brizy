import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementAudioUpload({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const dvk = (key) => defaultValueKey({ key, device, state });
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
