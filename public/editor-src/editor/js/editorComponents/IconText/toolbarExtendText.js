import {
  toolbarElementIconTextListDisabled,
  toolbarDisabledAdvancedSettings
} from "visual/utils/toolbar";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems({ v, device, state }) {
  return [
    toolbarElementIconTextListDisabled({
      v,
      device,
      devices: "desktop",
      state: "normal"
    }),
    {
      id: defaultValueKey({ key: "toolbarSettings", device, state: "normal" }),
      type: "popover",
      options: [toolbarDisabledAdvancedSettings({ device, state })]
    }
  ];
}
