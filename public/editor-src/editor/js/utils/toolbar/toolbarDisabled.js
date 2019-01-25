import { defaultValueKey } from "visual/utils/onChange";

export function toolbarDisabledHorizontalAlign({ device }) {
  return {
    id: defaultValueKey({ key: "horizontalAlign", device }),
    type: "toggle",
    disabled: true
  };
}

export function toolbarDisabledAdvancedSettings({ device }) {
  return {
    id: defaultValueKey({ key: "advancedSettings", device }),
    type: "advancedSettings",
    disabled: true
  };
}
