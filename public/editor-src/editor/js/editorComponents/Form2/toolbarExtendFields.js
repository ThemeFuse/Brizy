import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementForm2LabelSwitch,
  toolbarElementForm2PlaceholderSwitch,
  toolbarElementForm2SpacingPx
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    {
      id: dvk("toolbarCurrentElement"),
      type: "popover",
      options: [
        {
          id: dvk("currentShortcodeTabs"),
          type: "tabs",
          tabs: [
            {
              id: dvk("field"),
              options: [
                toolbarElementForm2SpacingPx({ v, device, state: "normal" })
              ]
            },
            {
              id: dvk("advanced"),
              options: [
                toolbarElementForm2LabelSwitch({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                }),
                toolbarElementForm2PlaceholderSwitch({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                })
              ]
            }
          ]
        }
      ]
    }
  ];
}
