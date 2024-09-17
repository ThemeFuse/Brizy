import { toolbarDisabledShowOnResponsive } from "visual/utils/toolbar";

export function getItems({ device }) {
  return [
    { id: "advancedSettings", type: "advancedSettings", disabled: true },
    toolbarDisabledShowOnResponsive({ device })
  ];
}
