import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import { toolbarSizeContainerSize } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    {
      id: defaultValueKey({ key: "toolbarSettings", device, state: "normal" }),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      position: 100,
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
