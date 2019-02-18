import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarColorHexAndOpacity({ v, device, state, onChange }) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "colorHex", state }),
    defaultValueValue({ v, key: "colorPalette", state })
  );
  const colorKey = defaultValueKey({ key: "color", device, state });
  const colorOpacityValue = defaultValueValue({
    v,
    key: "colorOpacity",
    device,
    state
  });

  return {
    id: colorKey,
    type: "colorPicker",
    value: {
      hex,
      opacity: colorOpacityValue
    },
    onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
      const values = {
        ...{ v, state, onChange },
        ...{ hex, opacity, isChanged, opacityDragEnd }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarColorPalette({ v, device, state, onChange }) {
  const colorPaletteKey = defaultValueKey({
    key: "colorPalette",
    device,
    state
  });
  const colorPaletteValue = defaultValueValue({
    v,
    key: "colorPalette",
    device,
    state
  });

  return {
    id: colorPaletteKey,
    type: "colorPalette",
    value: colorPaletteValue,
    onChange: palette => {
      const values = {
        ...{ v, state, onChange },
        ...{ palette }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarColorFields({ v, device, state, onChange }) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "colorHex", device, state }),
    defaultValueValue({ v, key: "colorPalette", device, state })
  );
  const colorFieldsKey = defaultValueKey({
    key: "colorFields",
    device,
    state
  });
  const colorOpacityValue = defaultValueValue({
    v,
    key: "colorOpacity",
    device,
    state
  });

  return {
    id: colorFieldsKey,
    type: "colorFields",
    value: {
      hex,
      opacity: colorOpacityValue
    },
    onChange: ({ hex, opacity, isChanged, opacityDragEnd }) => {
      const values = {
        ...{ v, state, onChange },
        ...{ hex, opacity, isChanged, opacityDragEnd }
      };
      return saveOnChanges(values);
    }
  };
}
