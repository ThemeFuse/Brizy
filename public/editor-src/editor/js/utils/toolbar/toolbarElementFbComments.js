import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementFbCommentsNumPosts({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "numPosts", device, state }),
    devices,
    label: t("Posts"),
    type: "slider",
    slider: {
      min: 5,
      max: 20
    },
    input: {
      show: true,
      min: 5,
      max: 20
    },
    suffix: {
      show: false
    },
    value: {
      value: defaultValueValue({ v, key: "numPosts", device, state })
    },
    onChange: ({ value }, { sliderDragEnd }) => {
      return (
        sliderDragEnd && {
          [defaultValueKey({ v, key: "numPosts", device, state })]: value
        }
      );
    }
  };
}

export function toolbarElementFbCommentsTargetUrl({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "targetUrl", device, state }),
    devices,
    label: t("Target URL"),
    type: "select",
    choices: [
      {
        title: t("Current Page"),
        value: "current"
      },
      {
        title: t("Custom Page"),
        value: "custom"
      }
    ],
    value: defaultValueValue({
      v,
      key: "targetUrl",
      device,
      state
    })
  };
}

export function toolbarElementFbCommentsHref({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "href", device, state }),
    devices,
    label: t("Link"),
    type: "input",
    disabled:
      defaultValueValue({
        v,
        key: "targetUrl",
        device,
        state
      }) === "current"
        ? true
        : false,
    placeholder: "http://",
    value: {
      value: defaultValueValue({
        v,
        key: "href",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "href", device, state })]: value
    })
  };
}
