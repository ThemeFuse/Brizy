import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarBgColorHexAndOpacity({ v, device, state, onChange }) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device, state }),
    defaultValueValue({ v, key: "bgColorPalette", device, state })
  );

  return {
    id: defaultValueKey({ key: "bgColor", device, state }),
    type: "colorPicker",
    value: {
      hex,
      opacity: defaultValueValue({ v, key: "bgColorOpacity", device, state })
    },
    onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ hex, opacity, isChanged, opacityDragEnd }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarBgColorPalette({ v, device, state, onChange }) {
  return {
    id: defaultValueKey({ key: "bgColorPalette", device, state }),
    type: "colorPalette",
    value: defaultValueValue({ v, key: "bgColorPalette", device, state }),
    onChange: palette => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ palette }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarBgColorFields({ v, device, state, onChange }) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device, state }),
    defaultValueValue({ v, key: "bgColorPalette", device, state })
  );

  return {
    id: defaultValueKey({ key: "bgColorFields", device, state }),
    type: "colorFields",
    value: {
      hex,
      opacity: defaultValueValue({ v, key: "bgColorOpacity", device, state })
    },
    onChange: ({ hex }) => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ hex }
      };
      return saveOnChanges(values);
    }
  };
}
