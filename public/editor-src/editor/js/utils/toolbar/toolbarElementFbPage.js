import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementFbPageTabs({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "pageTabs", device, state }),
    type: "select",
    devices,
    label: t("Tabs"),
    choices: [
      {
        title: t("Timeline"),
        value: "timeline"
      },
      {
        title: t("Events"),
        value: "events"
      },
      {
        title: t("Messages"),
        value: "messages"
      }
    ],
    value: defaultValueValue({ v, key: "pageTabs", device, state })
  };
}

export function toolbarElementFbPageHeight({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "height", device, state }),
    devices,
    label: t("Height"),
    type: "slider",
    slider: {
      min: 70,
      max: 800
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
      value: defaultValueValue({ v, key: "height", device, state })
    },
    onChange: ({ value }, { sliderDragEnd }) => {
      return (
        sliderDragEnd && {
          [defaultValueKey({ v, key: "height", device, state })]: value
        }
      );
    }
  };
}

export function toolbarElementFbPageSmallHeader({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "smallHeader", device, state }),
    devices,
    label: t("Use Small Header"),
    type: "switch",
    value: defaultValueValue({ v, key: "smallHeader", device, state })
  };
}

export function toolbarElementFbPageHideCover({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "hideCover", device, state }),
    devices,
    label: t("Hide Cover Photo"),
    type: "switch",
    value: defaultValueValue({ v, key: "hideCover", device, state })
  };
}

export function toolbarElementFbPageShowFacepile({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "showFacepile", device, state }),
    devices,
    label: t("Show Friend's Faces"),
    type: "switch",
    value: defaultValueValue({ v, key: "showFacepile", device, state })
  };
}

export function toolbarElementFbPageLink({
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
    placeholder: "https://facebook.com/brizy.io",
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
