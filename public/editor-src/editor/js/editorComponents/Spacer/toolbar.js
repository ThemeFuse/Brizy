import { t } from "visual/utils/i18n";
import {
  toolbarSizeHeightHeightPx,
  toolbarDisabledHorizontalAlign,
  toolbarDisabledAdvancedSettings
} from "visual/utils/toolbar";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems({ v, device }) {
  return [
    {
      id: defaultValueKey({ key: "toolbarSettings", device }),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeHeightHeightPx({
          v,
          device,
          state: "normal",
          config: {
            slider: {
              min: 10,
              max: 200
            }
          }
        }),
        toolbarDisabledAdvancedSettings({ device })
      ]
    },
    toolbarDisabledHorizontalAlign({ device })
  ];
}
