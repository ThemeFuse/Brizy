import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarLinkAnchor({
  v,
  device,
  state,
  devices = "all",
  disabled = false
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("linkAnchor"),
    label: t("Block"),
    type: "blockThumbnail",
    devices,
    disabled,
    value: dvv("linkAnchor")
  };
}
