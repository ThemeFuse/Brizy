import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import { toolbarSizeContainerSize } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    {
      id: defaultValueKey({ key: "toolbarSettings", device, state: "normal" }),
      type: "popover",
      title: t("Settings"),
      devices: "desktop",
      position: 110,
      options: [
        toolbarSizeContainerSize({
          v,
          device,
          state: "normal",
          devices: "desktop"
        })
      ]
    }
  ];
}
