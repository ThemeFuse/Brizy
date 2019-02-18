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

export function toolbarDisabledShowOnTablet() {
  return {
    id: "showOnTablet",
    type: "toggle",
    disabled: true
  };
}

export function toolbarDisabledShowOnMobile() {
  return {
    id: "showOnMobile",
    type: "toggle",
    disabled: true
  };
}
