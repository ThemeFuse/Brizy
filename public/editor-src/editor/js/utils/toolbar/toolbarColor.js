import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarColorHexAndOpacity({
  v,
  device,
  state,
  prefix = "color",
  onChange
}) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: `${prefix}Hex`, state }),
    defaultValueValue({ v, key: `${prefix}Palette`, state })
  );
  const colorKey = defaultValueKey({ key: prefix, device, state });
  const colorOpacityValue = defaultValueValue({
    v,
    key: `${prefix}Opacity`,
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
        ...{ v, state, prefix, onChange },
        ...{ hex, opacity, isChanged, opacityDragEnd }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarColorPalette({
  v,
  device,
  state,
  prefix = "color",
  onChange
}) {
  const colorPaletteKey = defaultValueKey({
    key: `${prefix}Palette`,
    device,
    state
  });
  const colorPaletteValue = defaultValueValue({
    v,
    key: `${prefix}Palette`,
    device,
    state
  });

  return {
    id: colorPaletteKey,
    type: "colorPalette",
    value: colorPaletteValue,
    onChange: palette => {
      const values = {
        ...{ v, state, prefix, onChange },
        ...{ palette }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarColorFields({
  v,
  device,
  state,
  prefix = "color",
  onChange
}) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: `${prefix}Hex`, device, state }),
    defaultValueValue({ v, key: `${prefix}Palette`, device, state })
  );
  const colorFieldsKey = defaultValueKey({
    key: `${prefix}Fields`,
    device,
    state
  });
  const colorOpacityValue = defaultValueValue({
    v,
    key: `${prefix}Opacity`,
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
        ...{ v, state, prefix, onChange },
        ...{ hex, opacity, isChanged, opacityDragEnd }
      };
      return saveOnChanges(values);
    }
  };
}
