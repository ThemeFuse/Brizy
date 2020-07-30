import {
  toolbarElementIconTextListDisabled,
  toolbarDisabledAdvancedSettings
} from "visual/utils/toolbar";

export function getItems({ v, device, state }) {
  return [
    toolbarElementIconTextListDisabled({
      v,
      device,
      devices: "desktop",
      state: "normal"
    }),
    {
      id: "toolbarSettings",
      type: "popover-dev",
      options: [toolbarDisabledAdvancedSettings({ device, state })]
    }
  ];
}
