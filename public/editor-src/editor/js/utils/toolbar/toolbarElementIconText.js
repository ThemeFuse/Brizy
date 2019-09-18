import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementIconTextListDisabled({
  v,
  device,
  state,
  devices = "all"
}) {
  return {
    id: defaultValueKey({ key: "list", device, state }),
    devices,
    type: "toggle",
    disabled: true
  };
}

export function toolbarElementIconTextIconPosition({
  v,
  device,
  state,
  devices = "all"
}) {
  return {
    id: defaultValueKey({ v, key: "iconPosition", device, state }),
    label: t("Position"),
    type: "radioGroup",
    roles: ["admin"],
    position: 50,
    choices: [
      {
        value: "left",
        icon: "nc-align-left"
      },
      {
        value: "right",
        icon: "nc-align-right"
      }
    ],
    devices,
    value: defaultValueValue({ v, key: "iconPosition", device, state })
  };
}

export function toolbarElementIconTextIconSpacing({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "iconSpacing", device, state }),
    devices,
    label: t("Spacing"),
    type: "slider",
    roles: ["admin"],
    slider: {
      min: 0,
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
    position: 70,
    value: {
      value: defaultValueValue({ v, key: "iconSpacing", device, state })
    },
    onChange: ({ value }) => {
      return {
        [defaultValueKey({ v, key: "iconSpacing", device, state })]: value
      };
    }
  };
}

export function toolbarElementIconDisabledSettings({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "toolbarSettings", device, state }),
    type: "popover",
    devices,
    options: [
      {
        id: defaultValueKey({ key: "advancedSettings", device, state }),
        type: "advancedSettings",
        disabled: true
      }
    ]
  };
}
