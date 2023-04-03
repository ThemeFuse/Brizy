import {
  defaultValueKey,
  defaultValueValue,
  saveOnChanges
} from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { capByPrefix } from "visual/utils/string";

export function toolbarTextShadowHexField2({
  v,
  device,
  disabled = false,
  state,
  states,
  onChange,
  prefix = "",
  devices = "all"
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const field = capByPrefix(textShadow, "field");
  const colorHex = capByPrefix(textShadow, "colorHex");
  const colorPalette = capByPrefix(textShadow, "colorPalette");
  const colorOpacity = capByPrefix(textShadow, "colorOpacity");
  const { hex } = getOptionColorHexByPalette(dvv(colorHex), dvv(colorPalette));

  return {
    devices,
    disabled,
    id: dvk(field),
    type: "colorFields",
    states,
    value: {
      hex,
      opacity: dvv(colorOpacity)
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

export function toolbarTextShadowFields2({
  v,
  device,
  disabled = false,
  state,
  states,
  onChange,
  prefix = "",
  devices = "all"
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const textShadow = capByPrefix(prefix, "textShadow");
  const fields = capByPrefix(textShadow, "fields");
  const blur = capByPrefix(textShadow, "blur");
  const vertical = capByPrefix(textShadow, "vertical");
  const horizontal = capByPrefix(textShadow, "horizontal");

  return {
    devices,
    disabled,
    states,
    id: dvk(fields),
    type: "multiInput",
    config: {
      defaultIcon: "nc-shadow",
      icons: ["nc-blur", "nc-vertical", "nc-horizontal"]
    },
    value: [dvv(blur), dvv(vertical), dvv(horizontal)],
    onChange: ([textShadowBlur, textShadowVertical, textShadowHorizontal]) => {
      const values = {
        ...{ v, device, state, prefix, onChange },
        ...{
          textShadowBlur,

          textShadowVertical,
          textShadowHorizontal
        }
      };

      return saveOnChanges(values);
    }
  };
}
