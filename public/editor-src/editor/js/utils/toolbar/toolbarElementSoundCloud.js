import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementSoundCloudLink({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "url", device, state }),
    label: t("Link"),
    type: "input",
    devices,
    placeholder: t("SoundCloud Link"),
    value: {
      value: defaultValueValue({
        v,
        key: "url",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "url", device, state })]: value
    })
  };
}

export function toolbarElementSoundCloudAutoPlay({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "autoPlay", device, state }),
    label: t("Auto Play"),
    devices,
    type: "switch",
    value: defaultValueValue({ v, key: "autoPlay", device, state })
  };
}

export function toolbarElementSoundCloudStyle({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    type: "multiPicker",
    roles: ["admin"],
    picker: {
      id: defaultValueKey({ key: "style", device, state }),
      label: t("Style"),
      type: "radioGroup",
      devices,
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
      value: defaultValueValue({
        v,
        key: "style",
        device,
        state
      }),
      onChange: value => ({
        [defaultValueKey({ v, key: "style", device, state })]: value,
        [defaultValueKey({ v, key: "showArtwork", device, state })]:
          value === "basic" ? "off" : "on",
        [defaultValueKey({ v, key: "height", device, state })]:
          value === "basic"
            ? defaultValueValue({
                v,
                key: "mediumHeight",
                device,
                state
              })
            : value === "artwork"
            ? defaultValueValue({
                v,
                key: "largeHeight",
                device,
                state
              })
            : defaultValueValue({
                v,
                key: "height",
                device,
                state
              })
      })
    }
  };
}
