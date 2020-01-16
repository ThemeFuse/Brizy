import {
  toolbarDisabledToolbarSettings,
  toolbarDisabledHorizontalAlign
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    toolbarDisabledHorizontalAlign({ v, device }),
    toolbarDisabledToolbarSettings({ device })
  ];
}
