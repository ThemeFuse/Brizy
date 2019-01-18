import { t } from "visual/utils/i18n";

export function toolbarElementSoundCloudLink({ v }) {
  return {
    id: "url",
    label: t("Link"),
    type: "input",
    placeholder: t("SoundCloud Link"),
    value: {
      value: v.url
    },
    onChange: ({ value: url }) => ({
      url
    })
  };
}

export function toolbarElementSoundCloudAutoPlay({ v }) {
  return {
    id: "autoPlay",
    label: t("Auto Play"),
    type: "switch",
    value: v.autoPlay
  };
}

export function toolbarElementSoundCloudStyle({ v }) {
  return {
    type: "multiPicker",
    roles: ["admin"],
    picker: {
      id: "style",
      label: t("Style"),
      type: "radioGroup",
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
      value: v.style,
      onChange: style => ({
        style,
        showArtwork: style === "basic" ? "off" : "on",
        height:
          style === "basic"
            ? v.mediumHeight
            : style === "artwork"
            ? v.largeHeight
            : v.height
      })
    }
  };
}
