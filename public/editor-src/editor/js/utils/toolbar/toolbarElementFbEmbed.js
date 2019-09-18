import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementFbEmbedType({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "type", device, state }),
    devices,
    type: "select",
    label: t("Embed"),
    choices: [
      {
        title: t("Post"),
        value: "post"
      },
      {
        title: t("Video"),
        value: "video"
      }
    ],
    value: defaultValueValue({ v, key: "type", device, state })
  };
}

export function toolbarElementFbEmbedPostAndVideoShowText({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "postAndVideoShowText", device, state }),
    devices,
    label: t("Include Full Post"),
    type: "switch",
    value: defaultValueValue({ v, key: "postAndVideoShowText", device, state })
  };
}

export function toolbarElementFbEmbedVideoAllowFullScreen({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "videoAllowFullScreen", device, state }),
    devices,
    label: t("Full Screen"),
    type: "switch",
    disabled:
      defaultValueValue({ v, key: "type", device, state }) === "video"
        ? false
        : true,
    value: defaultValueValue({
      v,
      key: "postAndVideoShowText",
      device,
      state
    })
  };
}

export function toolbarElementFbEmbedVideoAutoPlay({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "videoAutoPlay", device, state }),
    devices,
    label: t("AutoPlay"),
    type: "switch",
    disabled:
      defaultValueValue({ v, key: "type", device, state }) === "video"
        ? false
        : true,
    value: defaultValueValue({
      v,
      key: "videoAutoPlay",
      device,
      state
    })
  };
}

export function toolbarElementFbEmbedVideoCaptions({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "videoCaptions", device, state }),
    devices,
    label: t("Captions"),
    type: "switch",
    disabled:
      defaultValueValue({ v, key: "type", device, state }) === "video"
        ? false
        : true,
    value: defaultValueValue({
      v,
      key: "videoCaptions",
      device,
      state
    })
  };
}

export function toolbarElementFbEmbedPostHref({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "postHref", device, state }),
    devices,
    label: t("Link"),
    type: "input",
    disabled:
      defaultValueValue({ v, key: "type", device, state }) === "post"
        ? false
        : true,
    value: {
      value: defaultValueValue({
        v,
        key: "postHref",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "postHref", device, state })]: value
    })
  };
}

export function toolbarElementFbEmbedVideoHref({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "videoHref", device, state }),
    devices,
    label: t("Link"),
    type: "input",
    disabled:
      defaultValueValue({ v, key: "type", device, state }) === "video"
        ? false
        : true,
    value: {
      value: defaultValueValue({
        v,
        key: "videoHref",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "videoHref", device, state })]: value
    })
  };
}
