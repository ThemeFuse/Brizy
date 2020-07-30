import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementContainerTypeImageMap({
  v,
  device,
  devices = "all",
  state,
  states
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("media"),
    label: t("Type"),
    type: "radioGroup",
    devices,
    states,
    choices: [
      {
        value: "image",
        icon: "nc-media-image"
      },
      {
        value: "map",
        icon: "nc-media-map"
      }
    ],
    value: dvv("media") === "video" ? "image" : dvv("media")
  };
}
