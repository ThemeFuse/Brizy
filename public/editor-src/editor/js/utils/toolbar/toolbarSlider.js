import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarSliderColorHexAndOpacity({
  v,
  device,
  state,
  prefix,
  onChange
}) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: `${prefix}ColorHex`, device, state }),
    defaultValueValue({ v, key: `${prefix}ColorPalette`, device, state })
  );

  return {
    id: defaultValueKey({ key: `${prefix}Color`, device, state }),
    type: "colorPicker",
    value: {
      hex,
      opacity: defaultValueValue({
        v,
        key: `${prefix}ColorOpacity`,
        device,
        state
      })
    },
    onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
      const values = {
        ...{ v, device, state, prefix, onChange },
        ...{ hex, opacity, isChanged, opacityDragEnd }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarSliderColorPalette({
  v,
  device,
  state,
  prefix,
  onChange
}) {
  return {
    id: defaultValueKey({ key: `${prefix}ColorPalette`, device, state }),
    type: "colorPalette",
    value: defaultValueValue({
      v,
      key: `${prefix}ColorPalette`,
      device,
      state
    }),
    onChange: palette => {
      const values = {
        ...{ v, device, state, prefix, onChange },
        ...{ palette }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarSliderColorFields({
  v,
  device,
  state,
  prefix,
  onChange
}) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: `${prefix}ColorHex`, device, state }),
    defaultValueValue({ v, key: `${prefix}ColorPalette`, device, state })
  );

  return {
    id: defaultValueKey({ key: `${prefix}ColorFields`, device, state }),
    type: "colorFields",
    value: {
      hex,
      opacity: defaultValueValue({
        v,
        key: `${prefix}ColorOpacity`,
        device,
        state
      })
    },
    onChange: ({ hex }) => {
      const values = {
        ...{ v, device, state, prefix, onChange },
        ...{ hex }
      };
      return saveOnChanges(values);
    }
  };
}
