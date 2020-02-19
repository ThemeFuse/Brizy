import { capByPrefix } from "visual/utils/string";
import { getOptionColorHexByPalette } from "visual/utils/options";
import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";

export function toolbarColor2({
  v,
  device,
  state,
  states,
  disabled = false,
  prefix = "color",
  devices = "all",
  onChangeHex,
  onChangePalette
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex } = getOptionColorHexByPalette(
    dvv(capByPrefix(prefix, "hex")),
    dvv(capByPrefix(prefix, "palette"))
  );

  return {
    id: dvk(prefix),
    type: "colorPicker2",
    disabled,
    devices,
    states,
    select: {
      show: false
    },
    value: {
      hex,
      opacity: dvv(capByPrefix(prefix, "opacity")),
      palette: dvv(capByPrefix(prefix, "palette"))
    },
    onChange: ({ hex, opacity, palette, isChanged, opacityDragEnd }) => {
      const valuesHex = {
        ...{ v, device, state, prefix, onChange: onChangeHex },
        ...{ hex, opacity, isChanged, opacityDragEnd }
      };
      const valuesPalette = {
        ...{ v, device, state, prefix, onChange: onChangePalette },
        ...{ opacity, palette }
      };

      return isChanged === "hex" || isChanged === "opacity"
        ? saveOnChanges(valuesHex)
        : saveOnChanges(valuesPalette);
    }
  };
}

export function toolbarColorHexField2({
  v,
  device,
  state,
  disabled = false,
  states,
  devices = "all",
  prefix = "color",
  onChange
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex } = getOptionColorHexByPalette(
    dvv(capByPrefix(prefix, "hex")),
    dvv(capByPrefix(prefix, "palette"))
  );

  return {
    id: dvk(capByPrefix(prefix, "field")),
    type: "colorFields",
    devices,
    disabled,
    states,
    value: {
      hex,
      opacity: dvv(capByPrefix(prefix, "opacity"))
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
