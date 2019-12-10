import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementIconTextListDisabled({
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
  devices = "all",
  disabled = false,
  position = 90
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  return {
    id: dvk("iconPosition"),
    type: "toggle",
    roles: ["admin"],
    devices,
    disabled,
    position,
    choices: [
      {
        icon: "nc-hrz-align-left",
        title: t("Align"),
        value: "left"
      },
      {
        icon: "nc-hrz-align-right",
        title: t("Align"),
        value: "right"
      }
    ],
    value: dvv("iconPosition"),
    onChange: value => ({
      [dvk("iconPosition")]: value
    })
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
