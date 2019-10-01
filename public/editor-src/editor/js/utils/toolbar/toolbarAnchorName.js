import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarAnchorName({
  v,
  device,
  devices = "all",
  position = 30,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("anchorName"),
    label: t("Anchor Name"),
    type: "input",
    display: "block",
    position,
    devices,
    value: {
      value: dvv("anchorName")
    },
    onChange: ({ value: anchorName }) => ({
      [dvk("anchorName")]: anchorName
    })
  };
}
