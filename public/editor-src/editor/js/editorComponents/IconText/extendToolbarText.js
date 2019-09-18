import { toolbarElementIconTextListDisabled } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    toolbarElementIconTextListDisabled({
      v,
      device,
      devices: "desktop",
      state: "normal"
    })
  ];
}
