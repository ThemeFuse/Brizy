import { t } from "visual/utils/i18n";
import {
  toolbarSizeHeightHeightPx,
  toolbarDisabledHorizontalAlign,
  toolbarDisabledAdvancedSettings
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

  return [
    {
      id: "toolbarSettings",
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

export function getItemsForTablet(v) {
  const device = "tablet";
  const state = "normal";

  return [
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeHeightHeightPx({
          v,
          device,
          state,
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

export function getItemsForMobile(v) {
  const device = "mobile";
  const state = "normal";

  return [
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeHeightHeightPx({
          v,
          device,
          state,
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
