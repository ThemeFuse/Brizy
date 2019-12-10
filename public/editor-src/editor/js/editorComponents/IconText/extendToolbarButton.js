import {
  toolbarDisabledToolbarSettings,
  toolbarDisabledAdvancedSettings,
  toolbarDisabledShowOnResponsive
} from "visual/utils/toolbar";

export function getItems({ device }) {
  return [
    toolbarDisabledToolbarSettings({ device }),
    toolbarDisabledAdvancedSettings({ device }),
    toolbarDisabledShowOnResponsive({ device })
  ];
}
