import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementAudioUpload({
  v,
  device,
  state,
  devices = "all"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    id: dvk("audio"),
    label: t("File"),
    type: "fileUpload",
    acceptedExtensions: [".mp3", ".ogg", ".wav"],
    devices,
    value: dvv("audio")
  };
}

export function toolbarElementAudioShowCurrentTime({
  v,
  device,
  devices = "all",
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    id: dvk("showCurrentTime"),
    devices,
    label: t("Current Time"),
    type: "switch",
    value: dvv("showCurrentTime")
  };
}

export function toolbarElementAudioShowDurationTime({
  v,
  device,
  devices = "all",
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    id: dvk("showDurationTime"),
    devices,
    label: t("Duration Time"),
    type: "switch",
    value: dvv("showDurationTime")
  };
}

export function toolbarElementAudioShowProgressBarTrack({
  v,
  device,
  devices = "all",
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    id: dvk("showProgressBarTrack"),
    devices,
    label: t("Progress Bar"),
    type: "switch",
    value: dvv("showProgressBarTrack")
  };
}

export function toolbarElementAudioShowProgressBarVolume({
  v,
  device,
  devices = "all",
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    id: dvk("showProgressBarVolume"),
    devices,
    label: t("Volume"),
    type: "switch",
    value: dvv("showProgressBarVolume")
  };
}

export function toolbarElementAudioIconSize({
  v,
  device,
  devices = "all",
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });
  return {
    type: "multiPicker",
    roles: ["admin"],
    picker: {
      id: dvk("iconSize"),
      devices,
      label: t("Icon Size"),
      type: "radioGroup",
      choices: [
        {
          value: "small",
          icon: "nc-16"
        },
        {
          value: "medium",
          icon: "nc-24"
        },
        {
          value: "large",
          icon: "nc-32"
        },
        {
          value: "custom",
          icon: "nc-more"
        }
      ],
      value: dvv("iconSize"),
      onChange: iconSize => {
        return {
          [dvk("iconSize")]: iconSize,
          iconCustomSize:
            iconSize === "small"
              ? dvv("smallIconSize")
              : iconSize === "medium"
              ? dvv("mediumIconSize")
              : iconSize === "large"
              ? dvv("largeIconSize")
              : dvv("iconCustomSize")
        };
      }
    },
    choices: {
      custom: [
        {
          id: dvk("iconCustomSize"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: dvv("iconCustomSize")
          },
          onChange: ({ value: iconCustomSize }) => {
            return {
              [dvk("iconCustomSize")]: iconCustomSize
            };
          }
        }
      ]
    }
  };
}

export function toolbarElementAudioCover({
  v,
  device,
  devices = "all",
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvk = key => defaultValueKey({ key, device, state });

  return {
    id: dvk("cover"),
    devices,
    label: t("Cover"),
    type: "imageSetter",
    value: {
      width: dvv("coverImageWidth"),
      height: dvv("coverImageHeight"),
      src: dvv("coverImageSrc"),
      x: dvv("coverPositionX"),
      y: dvv("coverPositionY"),
      extension: dvv("coverImageExtension")
    },
    onChange: ({ width, height, src, x, y, extension }) => {
      return {
        [dvk("coverImageWidth")]: width,
        [dvk("coverImageHeight")]: height,
        [dvk("coverImageSrc")]: src,
        [dvk("coverPositionX")]: x,
        [dvk("coverPositionY")]: y,
        [dvk("coverImageExtension")]: extension
      };
    }
  };
}
