import { defaultValueKey } from "visual/utils/onChange";

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
