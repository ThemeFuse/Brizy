import {
  toolbarDisabledAdvancedSettings,
  toolbarDisabledShowOnResponsive
} from "visual/utils/toolbar";

export function getItems({ device }) {
  return [
    toolbarDisabledAdvancedSettings({ device }),
    toolbarDisabledShowOnResponsive({ device })
  ];
}
