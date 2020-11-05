import { toolbarDisabledAdvancedSettings } from "visual/utils/toolbar";

export function getItems({ device, state }) {
  return [
    {
      id: "list",
      type: "toggle",
      devices: "desktop",
      disabled: true
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      options: [toolbarDisabledAdvancedSettings({ device, state })]
    }
  ];
}
