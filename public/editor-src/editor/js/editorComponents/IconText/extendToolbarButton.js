import {
  toolbarDisabledToolbarSettings,
  toolbarDisabledAdvancedSettings,
  toolbarDisabledShowOnResponsive
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    toolbarDisabledToolbarSettings({
      device
    }),
    toolbarDisabledAdvancedSettings({
      device
    }),
    toolbarDisabledShowOnResponsive({
      device
    })
  ];
}
