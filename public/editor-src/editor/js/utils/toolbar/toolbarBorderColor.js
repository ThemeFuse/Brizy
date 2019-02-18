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
  const borderColorKey = defaultValueKey({
    key: "borderColor",
    device,
    state
  });
  const borderColorOpacityValue = defaultValueValue({
    v,
    key: "borderColorOpacity",
    device,
    state
  });

  return {
    id: borderColorKey,
    type: "colorPicker",
    value: {
      hex,
      opacity: borderColorOpacityValue
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
  const borderColorPaletteKey = defaultValueKey({
    key: "borderColorPalette",
    device,
    state
  });
  const borderColorPaletteValue = defaultValueValue({
    v,
    key: "borderColorPalette",
    device,
    state
  });

  return {
    id: borderColorPaletteKey,
    type: "colorPalette",
    value: borderColorPaletteValue,
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
  const borderColorFieldsKey = defaultValueKey({
    key: "borderColorFields",
    device,
    state
  });
  const borderColorOpacityValue = defaultValueValue({
    v,
    key: "borderColorOpacity",
    device,
    state
  });

  return {
    id: borderColorFieldsKey,
    type: "colorFields",
    value: {
      hex,
      opacity: borderColorOpacityValue
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
