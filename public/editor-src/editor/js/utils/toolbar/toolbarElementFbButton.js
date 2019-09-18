import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementFbButtonType({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "type", device, state }),
    type: "select",
    devices,
    label: t("Type"),
    choices: [
      {
        title: t("Like"),
        value: "like"
      },
      {
        title: t("Recommend"),
        value: "recommend"
      }
    ],
    value: defaultValueValue({ v, key: "type", device, state })
  };
}

export function toolbarElementFbButtonLayout({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "layout", device, state }),
    label: t("Layout"),
    type: "select",
    devices,
    choices: [
      {
        title: t("Button"),
        value: "button"
      },
      {
        title: t("Boxed"),
        value: "boxed"
      }
    ],
    value: defaultValueValue({ v, key: "layout", device, state })
  };
}

export function toolbarElementFbButtonSize({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "size", device, state }),
    label: t("Size"),
    devices,
    type: "radioGroup",
    choices: [
      {
        icon: "nc-small",
        value: "small"
      },
      {
        icon: "nc-large",
        value: "large"
      }
    ],
    value: defaultValueValue({ v, key: "size", device, state })
  };
}

export function toolbarElementFbButtonShare({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    devices,
    id: defaultValueKey({ key: "share", device, state }),
    type: "switch",
    label: t("Include Share Button"),
    value: defaultValueValue({ v, key: "share", device, state })
  };
}

export function toolbarElementFbButtonCounter({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "showCounter", device, state }),
    type: "switch",
    devices,
    disabled: v.layout === "boxed" ? true : false,
    label: t("Show Button Counter"),
    value: defaultValueValue({ v, key: "showCounter", device, state })
  };
}

export function toolbarElementFbButtonFriends({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "showFriends", device, state }),
    devices,
    type: "switch",
    disabled: v.layout === "boxed" ? true : false,
    label: t("Show Friends' Faces"),
    value: defaultValueValue({ v, key: "showFriends", device, state })
  };
}
