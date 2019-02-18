import { t } from "visual/utils/i18n";

export function toolbarBgVideoUrl({ v, disabled = false }) {
  return {
    id: "bgVideo",
    label: t("URL"),
    type: "input",
    inputType: "video",
    placeholder: t("YouTube or Vimeo"),
    disabled,
    value: {
      value: v.bgVideo
    },
    onChange: ({ value: bgVideo }) => ({
      bgVideo,

      bgColorOpacity:
        bgVideo !== "" && v.bgColorOpacity === 1 ? 0.8 : v.bgColorOpacity,

      tempBgColorOpacity:
        bgVideo !== "" && v.bgColorOpacity === 1 ? 0.8 : v.tempBgColorOpacity
    })
  };
}

export function toolbarBgVideoQuality({ v, disabled = false }) {
  return {
    id: "bgVideoQuality",
    label: t("Quality"),
    type: "select",
    disabled,
    choices: [
      {
        title: t("1080p"),
        value: 1080
      },
      {
        title: t("720p"),
        value: 720
      }
    ],
    value: v.bgVideoQuality
  };
}

export function toolbarBgVideoLoop({ v, disabled = false }) {
  return {
    id: "bgVideoLoop",
    label: t("Loop"),
    type: "switch",
    disabled,
    value: v.bgVideoLoop
  };
}
