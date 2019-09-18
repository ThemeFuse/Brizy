import {
  toolbarDisabledSettings,
  toolbarDisabledAdvancedSettings,
  toolbarDisabledShowOnResponsive
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    toolbarDisabledSettings({
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
