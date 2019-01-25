import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarBorderColorHexAndOpacity({
  v,
  device,
  state,
  onChange
}) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device, state }),
    defaultValueValue({ v, key: "borderColorPalette", device, state })
  );

  return {
    id: defaultValueKey({ key: "borderColor", device, state }),
    type: "colorPicker",
    value: {
      hex,
      opacity: defaultValueValue({
        v,
        key: "borderColorOpacity",
        device,
        state
      })
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

export function toolbarBorderColorPalette({ v, device, state, onChange }) {
  return {
    id: defaultValueKey({ key: "borderColorPalette", device, state }),
    type: "colorPalette",
    value: defaultValueValue({
      v,
      key: "borderColorPalette",
      device,
      state
    }),
    onChange: palette => {
      const values = {
        ...{ v, device, state, onChange },
        ...{ palette }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarBorderColorFields({ v, device, state, onChange }) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device, state }),
    defaultValueValue({ v, key: "borderColorPalette", device, state })
  );

  return {
    id: defaultValueKey({ key: "borderColorFields", device, state }),
    type: "colorFields",
    value: {
      hex,
      opacity: defaultValueValue({
        v,
        key: "borderColorOpacity",
        device,
        state
      })
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
