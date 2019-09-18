import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementFbGroupWidth({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "width", device, state }),
    devices,
    label: t("Width"),
    type: "slider",
    slider: {
      min: 180,
      max: 500
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
      value: defaultValueValue({ v, key: "width", device, state })
    },
    onChange: ({ value }, { sliderDragEnd }) => {
      return (
        sliderDragEnd && {
          [defaultValueKey({ v, key: "width", device, state })]: value
        }
      );
    }
  };
}

export function toolbarElementFbGroupSkin({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "skin", device, state }),
    devices,
    type: "select",
    label: t("Skin"),
    choices: [
      {
        title: t("Light"),
        value: "light"
      },
      {
        title: t("Dark"),
        value: "dark"
      }
    ],
    value: defaultValueValue({ v, key: "skin", device, state })
  };
}

export function toolbarElementFbGroupShowSocialContext({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "showSocialContext", device, state }),
    devices,
    type: "switch",
    label: t("Show Social Context"),
    value: defaultValueValue({ v, key: "showSocialContext", device, state })
  };
}

export function toolbarElementFbGroupShowMetaData({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "showMetaData", device, state }),
    devices,
    type: "switch",
    label: t("Show Meta Data"),
    value: defaultValueValue({ v, key: "showMetaData", device, state })
  };
}

export function toolbarElementFbGroupLink({
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
    placeholder: "https://www.facebook.com/groups/brizy/",
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
