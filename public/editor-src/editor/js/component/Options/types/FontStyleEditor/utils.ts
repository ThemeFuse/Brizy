import { DeviceMode } from "visual/types";
import { defaultValueKey } from "visual/utils/onChange";
import { NORMAL } from "visual/utils/stateMode";
import { ModelType, Styles } from "./types";

export const optionValueToModel = (value: Styles, device: DeviceMode) => {
  const model: ModelType = {};

  Object.entries(value).forEach(([key, value]) => {
    let k = key;

    if (key === "fontFamily" || key === "fontFamilyType") {
      k = key;
    } else {
      k = defaultValueKey({ key, device, state: NORMAL });
    }
    model[k] = value;
  });

  return model;
};
