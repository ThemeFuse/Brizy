import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarBgColorHexAndOpacity({
  v,
  device,
  state,
  prefix,
  disabled = false,
  onChange
}) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: `${prefix}ColorHex`, device, state }),
    defaultValueValue({ v, key: `${prefix}ColorPalette`, device, state })
  );
  const prefixColorKey = defaultValueKey({
    key: `${prefix}Color`,
    device,
    state
  });
  const prefixColorOpacityValue = defaultValueValue({
    v,
    key: `${prefix}ColorOpacity`,
    device,
    state
  });

  return {
    id: prefixColorKey,
    type: "colorPicker",
    disabled,
    value: {
      hex,
      opacity: prefixColorOpacityValue
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

export function toolbarBgColorPalette({
  v,
  device,
  state,
  prefix,
  disabled = false,
  onChange
}) {
  const prefixColorPaletteKey = defaultValueKey({
    key: "borderColorPalette",
    device,
    state
  });
  const prefixColorPaletteValue = defaultValueValue({
    v,
    key: `${prefix}ColorPalette`,
    device,
    state
  });

  return {
    id: prefixColorPaletteKey,
    type: "colorPalette",
    disabled,
    value: prefixColorPaletteValue,
    onChange: palette => {
      const values = {
        ...{ v, device, state, prefix, onChange },
        ...{ palette }
      };
      return saveOnChanges(values);
    }
  };
}

export function toolbarBgColorFields({
  v,
  device,
  state,
  prefix,
  className = "",
  disabled = false,
  onChange
}) {
  const { hex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: `${prefix}ColorHex`, device, state }),
    defaultValueValue({ v, key: `${prefix}ColorPalette`, device, state })
  );
  const prefixColorFieldsKey = defaultValueKey({
    key: `${prefix}ColorFields`,
    device,
    state
  });
  const prefixColorOpacityValue = defaultValueValue({
    v,
    key: `${prefix}ColorOpacity`,
    device,
    state
  });

  return {
    id: prefixColorFieldsKey,
    type: "colorFields",
    disabled,
    className,
    value: {
      hex,
      opacity: prefixColorOpacityValue
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
