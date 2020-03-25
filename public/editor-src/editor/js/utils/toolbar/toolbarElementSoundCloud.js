import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementSoundCloudStyle({
  v,
  device,
  devices = "all",
  disabled = false,
  state
}) {
  return {
    type: "multiPicker",
    roles: ["admin"],
    devices,
    disabled,
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
