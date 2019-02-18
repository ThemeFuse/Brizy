import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementContainerTypeAll({ v }) {
  return {
    id: "media",
    label: t("Type"),
    type: "radioGroup",
    choices: [
      {
        value: "image",
        icon: "nc-media-image"
      },
      {
        value: "video",
        icon: "nc-media-video"
      },
      {
        value: "map",
        icon: "nc-media-map"
      }
    ],
    value: v.media
  };
}

export function toolbarElementContainerTypeImageMap({ v, device, state }) {
  return {
    id: defaultValueKey({ key: "media", device, state }),
    label: t("Type"),
    type: "radioGroup",
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
    value:
      defaultValueValue({ v, key: "media", device, state }) === "video"
        ? "image"
        : defaultValueValue({ v, key: "media", device, state })
  };
}
